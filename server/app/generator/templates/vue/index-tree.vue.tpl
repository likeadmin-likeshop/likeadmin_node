<template>
    <div class="index-tree">
        <el-card class="!border-none mb-4" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" v-model="queryParams" inline>
                {%- for column in columns %}
                    {%- if column.isQuery %}
                        {%- if column.htmlType == "datetime" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <daterange-picker
                                    v-model:startTime="queryParams.createTimeStart"
                                    v-model:endTime="queryParams.createTimeEnd"
                                ></daterange-picker>
                            </el-form-item>
                        {%- elif column.htmlType in ["select", "radio"] %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-select v-model="queryParams.{{ column.javaField }}" class="w-[280px]" clearable>
                                    {%- if column.dictType == "" %}
                                        <el-option label="请选择字典生成" value=""></el-option>
                                    {%- else %}
                                        <el-option label="全部" value=""></el-option>
                                        {%- for item in dictData[column.dictType] %}
                                            <el-option
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        {%- endfor %}
                                    {%- endif %}
                                </el-select>
                            </el-form-item>
                        {%- elif column.htmlType == "input" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-input class="w-[280px]" v-model="queryParams.{{ column.javaField }}"></el-input>
                            </el-form-item>
                        {%- endif %}
                    {%- endif %}
                {%- endfor %}
                <el-form-item>
                    <el-button type="primary" @click="getLists">查询</el-button>
                    <el-button @click="getLists">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" shadow="never">
            <div>
                <el-button v-perms="['{{ moduleName }}:add']" type="primary" @click="handleAdd()">
                    <template #icon>
                        <icon name="el-icon-Plus"></icon>
                    </template>
                    新增
                </el-button>
                <el-button @click="handleExpand"> 展开/折叠 </el-button>
            </div>
            <el-table
                v-loading="loading"
                ref="tableRef"
                class="mt-4"
                size="large"
                :data="lists"
                row-key="{{ table.treePrimary }}"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            >
                {%- for column in columns %}
                    {%- if column.isList %}
                        {%- if column.dictType != "" and column.htmlType in ["select", "radio", "checkbox"] %}
                            <el-table-column label="{{ column.columnComment }}" prop="{{ column.javaField }}" min-width="100">
                                <template #default="{ row }">
                                    <dict-value :options="dictData.{{ column.dictType }}" :value="row.{{ column.javaField }}"></dict-value>
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
                                    ></image-contain>
                                </template>
                            </el-table-column>
                        {%- else %}
                            <el-table-column label="{{ column.columnComment }}" prop="{{ column.javaField }}" min-width="100"></el-table-column>
                        {%- endif %}
                    {%- endif %}
                {%- endfor %}
                <el-table-column label="操作" width="160" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['{{ moduleName }}:add']" type="primary" link @click="handleAdd(row.{{ table.treePrimary }})">新增</el-button>
                        <el-button v-perms="['{{ moduleName }}:edit']" type="primary" link @click="handleEdit(row)">编辑</el-button>
                        <el-button v-perms="['{{ moduleName }}:del']" type="danger" link @click="handleDelete(row.{{ primaryKey }})">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <edit-popup
            v-if="showEdit"
            ref="editRef"
            {%- if dictFields|length >= 1 %}
            :dict-data="dictData"
            {%- endif %}
            @success="getLists"
            @close="showEdit = false"
        ></edit-popup>
    </div>
</template>
<script lang="ts" setup name="{{ moduleName }}">
import { {{ moduleName }}Delete, {{ moduleName }}Lists } from '@/api/{{ moduleName }}'
import EditPopup from './edit.vue'
import feedback from '@/utils/feedback'
{%- if dictFields|length >= 1 %}
    import { useDictData } from '@/hooks/useDictOptions'
{%- endif %}
import type { ElTable } from 'element-plus'

const tableRef = shallowRef<InstanceType<typeof ElTable>>()
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
let isExpand = false
const showEdit = ref(false)
const loading = ref(false)
const lists = ref<any[]>([])

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

const getLists = async () => {
    loading.value = true
    try {
        const data = await {{ moduleName }}Lists(queryParams)
        lists.value = data
        loading.value = false
    } catch (error) {
        loading.value = false
    }
}

{%- if dictFields|length >= 1 %}
    {% set dictSize = dictFields|length - 1 %}
    const { dictData } = useDictData({
        {%- for field in dictFields %}
            {{ field }}: []
            {%- if loop.index != dictSize %},{%- endif %}
        {%- endfor %}
    })
{%- endif %}

const handleAdd = async ({{ table.treePrimary }}?: number) => {
    showEdit.value = true
    await nextTick()
    if ({{ table.treePrimary }}) {
        editRef.value?.setFormData({
            {{ table.treeParent }}: {{ table.treePrimary }}
        })
    }
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

const handleExpand = () => {
    isExpand = !isExpand
    toggleExpand(lists.value, isExpand)
}

const toggleExpand = (children: any[], unfold = true) => {
    for (const key in children) {
        tableRef.value?.toggleRowExpansion(children[key], unfold)
        if (children[key].children) {
            toggleExpand(children[key].children!, unfold)
        }
    }
}

getLists()
</script>
