<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
            {%- for column in columns %}
                {%- if column.isQuery == 1 %}
                    {%- if column.htmlType == "datetime" %}
                        <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                        <daterange-picker
                            v-model:startTime="queryParams.createTimeStart"
                            v-model:endTime="queryParams.createTimeEnd"
                        />
                        </el-form-item>
                    {%- elif column.htmlType == "select" or column.htmlType == "radio" %}
                        <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                        <el-select
                            v-model="queryParams.{{ column.javaField }}"
                            class="w-[280px]"
                            clearable
                        >
                            {%- if column.dictType == "" %}
                                <el-option label="请选择字典生成" value="" />
                            {%- else %}
                                <el-option label="全部" value="" />
                                {%- for item in dictData[column.dictType] %}
                                    <el-option
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                    />
                                {%- endfor %}
                            {%- endif %}
                        </el-select>
                        </el-form-item>
                    {%- elif column.htmlType == "input" %}
                        <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                        <el-input class="w-[280px]" v-model="queryParams.{{ column.javaField }}" />
                        </el-form-item>
                    {%- endif %}
                {%- endif %}
            {%- endfor %}
            <el-form-item>
                <el-button type="primary" @click="resetPage">查询</el-button>
                <el-button @click="resetParams">重置</el-button>
            </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <div>
            <el-button v-perms="['{{ moduleName }}:add']" type="primary" @click="handleAdd()">
                <template #icon>
                <icon name="el-icon-Plus" />
                </template>
                新增
            </el-button>
            </div>
            <el-table class="mt-4" size="large" v-loading="pager.loading" :data="pager.lists">
            {%- for column in columns %}
                {%- if column.isList %}
                    {%- if column.dictType != "" and (column.htmlType == "select" or column.htmlType == "radio" or column.htmlType == "checkbox") %}
                        <el-table-column label="{{ column.columnComment }}" prop="{{ column.javaField }}" min-width="100">
                        <template #default="{ row }">
                            <dict-value :options="dictData[column.dictType]" :value="row.{{ column.javaField }}" />
                        </template>
                        </el-table-column>
                    {%- elif column.htmlType == "imageUpload" %}
                        <el-table-column label="{{ column.columnComment }}" prop="{{ column.javaField }}" min-width="100">
                        <template #default="{ row }">
                            <image-contain
                            :width="40"
                            :height="40"
                            :src="row.{{ column.javaField }}"
                            :preview-src-list="[row.{{ column.javaField }}]"
                            preview-teleported
                            hide-on-click-modal
                            />
                        </template>
                        </el-table-column>
                    {%- else %}
                        <el-table-column label="{{ column.columnComment }}" prop="{{ column.javaField }}" min-width="100" />
                    {%- endif %}
                {%- endif %}
            {%- endfor %}
            <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                <el-button
                    v-perms="['{{ moduleName }}:edit']"
                    type="primary"
                    link
                    @click="handleEdit(row)"
                >
                    编辑
                </el-button>
                <el-button
                    v-perms="['{{ moduleName }}:del']"
                    type="danger"
                    link
                    @click="handleDelete(row.{{ primaryKey }})"
                >
                    删除
                </el-button>
                </template>
            </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
            <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <edit-popup
            v-if="showEdit"
            ref="editRef"
            {%- if dictFields|length >= 1 %}
            :dict-data="dictData"
            {%- endif %}
            @success="getLists"
            @close="showEdit = false"
        />
    </div>
</template>
<script lang="ts" setup name="{{ moduleName }}">
import { {{ moduleName }}Delete, {{ moduleName }}Lists } from '@/api/{{ moduleName }}'
{%- if dictFields|length >= 1 %}
import '@/hooks/useDictOptions' as DictOptions
{%- endif %}
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
{%- for column in columns %}
    {%- if column.isQuery %}
        {%- if column.htmlType == "datetime" %}
            {{ column.javaField }}Start: '',
            {{ column.javaField }}End: '',
        {%- else %}
            {{ column.javaField }}: '',
        {%- endif %}
    {%- endif %}
{%- endfor %}
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: {{ moduleName }}Lists,
    params: queryParams
})

{%- if dictFields|length >= 1 %}
    const dictData = DictOptions.useDictData<{
        {% for dictField in dictFields %}
            {{ dictField }}: any[],
        {% endfor %}
    }>([
        {% for dictField in dictFields %}
            '{{ dictField }}',
        {% endfor %}
    ])
{%- endif %}

const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.getDetail(data)
}

const handleDelete = async ({{ primaryKey }}: number) => {
    await feedback.confirm('确定要删除？')
    await {{ moduleName }}Delete({ {{ primaryKey }} })
    feedback.msgSuccess('删除成功')
    getLists()
}

getLists()
</script>