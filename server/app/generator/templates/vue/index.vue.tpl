<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
            {% for column in columns %}
            {% if column.isQuery == 1 %}
                {% if column.htmlType == "datetime" %}
                <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                    <daterange-picker
                        v-model:startTime="queryParams.createTimeStart"
                        v-model:endTime="queryParams.createTimeEnd"
                    />
                </el-form-item>
                {% elif column.htmlType == "select" or column.htmlType == "radio" %}
                <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                    <el-select
                        v-model="queryParams.{{ column.javaField }}"
                        class="w-[280px]"
                        clearable
                    >
                        {% if column.dictType == "" %}
                        <el-option label="请选择字典生成" value="" />
                        {% else %}
                        <el-option label="全部" value="" />
                        <el-option
                            v-for="(item, index) in dictData.{{ column.dictType }}"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        />
                        {% endif %}
                    </el-select>
                </el-form-item>
                {% elif column.htmlType == "input" %}
                <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                    <el-input class="w-[280px]" v-model="queryParams.{{ column.javaField }}" />
                </el-form-item>
                {% endif %}
            {% endif %}
            {% endfor %}
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <div>
                <el-button v-perms="['{{ ModuleName }}:add']" type="primary" @click="handleAdd()">
                    <template #icon>
                        <icon name="el-icon-Plus" />
                    </template>
                    新增
                </el-button>
            </div>
            <el-table
                class="mt-4"
                size="large"
                v-loading="pager.loading"
                :data="pager.lists"
            >
            {% for column in Columns %}
            {% if column.IsList %}
                {% if column.DictType != "" and column.HtmlType == "select" or column.HtmlType == "radio" or column.HtmlType == "checkbox" %}
                <el-table-column label="{{ column.ColumnComment }}" prop="{{ column.JavaField }}" min-width="100">
                    <template #default="{ row }">
                        <dict-value :options="dictData.{{ column.DictType }}" :value="row.{{ column.JavaField }}" />
                    </template>
                </el-table-column>
                {% elif column.HtmlType == "imageUpload" %}
                <el-table-column label="{{ column.ColumnComment }}" prop="{{ column.JavaField }}" min-width="100">
                    <template #default="{ row }">
                        <image-contain
                            :width="40"
                            :height="40"
                            :src="row.{{ column.JavaField }}"
                            :preview-src-list="[row.{{ column.JavaField }}]"
                            preview-teleported
                            hide-on-click-modal
                        />
                    </template>
                </el-table-column>
                {% else %}
                <el-table-column label="{{ column.ColumnComment }}" prop="{{ column.JavaField }}" min-width="100" />
                {% endif %}
            {% endif %}
            {% endfor %}
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            v-perms="['{{ ModuleName }}:edit']"
                            type="primary"
                            link
                            @click="handleEdit(row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-perms="['{{ ModuleName }}:del']"
                            type="danger"
                            link
                            @click="handleDelete(row.{{ PrimaryKey }})"
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
            {% if (DictFields | length > 1) %}
            :dict-data=dictData
            {% endif %}
            @success="getLists"
            @close="showEdit = false"
        />
    </div>
</template>
<script lang="ts" setup>
import { {{ ModuleName }}Delete, {{ ModuleName }}Lists } from '@/api/{{ ModuleName }}'
{% if (DictFields | length >= 1) %}
import { useDictData } from '@/hooks/useDictOptions'
{% endif %}
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
const editRef = shallowRef();
const showEdit = ref(false);
const queryParams = reactive({
{% for column in Columns %}
{% if column.IsQuery %}
{% if column.HtmlType == 'datetime' %}
{{ column.JavaField }}Start: '',
{{ column.JavaField }}End: '',
{% else %}
{{ column.JavaField }}: '',
{% endif %}
{% endif %}
{% endfor %}
});

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: {{ ModuleName }}Lists,
    params: queryParams
});

{% if (DictFields | length >= 1) %}
const { dictData } = useDictData<{
    {% for field in DictFields %}
    {{ field }}: any[]
    {% endfor %}
}>(['{% for field in DictFields %}'{{ field }}'{% if not loop.last %},{% endif %}{% endfor %}]);
{% endif %}

const handleAdd = async () => {
    showEdit.value = true;
    await nextTick();
    editRef.value?.open('add');
};

const handleEdit = async (data: any) => {
    showEdit.value = true;
    await nextTick();
    editRef.value?.open('edit');
    editRef.value?.getDetail(data);
};

const handleDelete = async ({{ PrimaryKey }}: number) => {
    await feedback.confirm('确定要删除？');
    await {{ ModuleName }}Delete({{ PrimaryKey }});
    feedback.msgSuccess('删除成功');
    getLists();
};

getLists();
</script>