<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            title="{{ popupTitle }}"
            async="true"
            width="550px"
            clickModalClose="true"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" model="formData" label-width="84px" :rules="formRules">
                {%- for column in columns %}
                    {%- if column.isEdit %}
                        {%- if column.javaField == $.Table.TreeParent and column.javaField != "" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-tree-select
                                    class="flex-1"
                                    v-model="formData.{{ column.javaField }}"
                                    data="treeList"
                                    clearable
                                    node-key="{{ $.Table.TreePrimary }}"
                                    props="{ label: '{{ $.Table.TreeName }}', value: '{{ $.Table.TreePrimary }}', children: 'children' }"
                                    default-expand-all="true"
                                    placeholder="请选择{{ column.columnComment }}"
                                    check-strictly
                                />
                            </el-form-item>
                        {%- elif column.htmlType == "input" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-input v-model="formData.{{ column.javaField }}" placeholder="请输入{{ column.columnComment }}" />
                            </el-form-item>
                        {%- elif column.htmlType == "number" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-input-number v-model="formData.{{ column.javaField }}" :max="9999" />
                            </el-form-item>
                        {%- elif column.htmlType == "textarea" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-input
                                    v-model="formData.{{ column.javaField }}"
                                    placeholder="请输入{{ column.columnComment }}"
                                    type="textarea"
                                    autosize="{ minRows: 4, maxRows: 6 }"
                                />
                            </el-form-item>
                        {%- elif column.htmlType == "checkbox" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-checkbox-group v-model="formData.{{ column.javaField }}" placeholder="请选择{{ column.columnComment }}">
                                    {%- if column.dictType != "" %}
                                        {%- for item in dictData[column.dictType] %}
                                            <el-checkbox
                                                :key="index"
                                                :label="item.value"
                                                :disabled="!item.status"
                                            >
                                                {{ item.name }}
                                            </el-checkbox>
                                        {%- endfor %}
                                    {%- else %}
                                        <el-checkbox>请选择字典生成</el-checkbox>
                                    {%- endif %}
                                </el-checkbox-group>
                            </el-form-item>
                        {%- elif column.htmlType == "select" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-select class="flex-1" v-model="formData.{{ column.javaField }}" placeholder="请选择{{ column.columnComment }}">
                                    {%- if column.dictType != "" %}
                                        {%- for item in dictData[column.dictType] %}
                                            <el-option
                                                :key="index"
                                                :label="item.name"
                                                {%- if column.javaType == "Integer" %}
                                                :value="parseInt(item.value)"
                                                {%- else %}
                                                :value="item.value"
                                                {%- endif %}
                                                clearable
                                                :disabled="!item.status"
                                            />
                                        {%- endfor %}
                                    {%- else %}
                                        <el-option label="请选择字典生成" value="" />
                                    {%- endif %}
                                </el-select>
                            </el-form-item>
                        {%- elif column.htmlType == "radio" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-radio-group v-model="formData.{{ column.javaField }}" placeholder="请选择{{ column.columnComment }}">
                                    {%- if column.dictType != "" %}
                                        {%- for item in dictData[column.dictType] %}
                                            <el-radio
                                                :key="index"
                                                {%- if column.javaType == "Integer" %}
                                                :label="parseInt(item.value)"
                                                {%- else %}
                                                :label="item.value"
                                                {%- endif %}
                                                :disabled="!item.status"
                                            >
                                                {{ item.name }}
                                            </el-radio>
                                        {%- endfor %}
                                    {%- else %}
                                        <el-radio label="0">请选择字典生成</el-radio>
                                    {%- endif %}
                                </el-radio-group>
                            </el-form-item>
                        {%- elif column.htmlType == "datetime" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <el-date-picker
                                    class="flex-1 !flex"
                                    v-model="formData.{{ column.javaField }}"
                                    type="datetime"
                                    clearable
                                    value-format="YYYY-MM-DD hh:mm:ss"
                                    placeholder="请选择{{ column.columnComment }}"
                                />
                            </el-form-item>
                        {%- elif column.htmlType == "editor" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <editor v-model="formData.{{ column.javaField }}" height="500" />
                            </el-form-item>
                        {%- elif column.htmlType == "imageUpload" %}
                            <el-form-item label="{{ column.columnComment }}" prop="{{ column.javaField }}">
                                <material-picker v-model="formData.{{ column.javaField }}" />
                            </el-form-item>
                        {%- endif %}
                    {%- endif %}
                {%- endfor %}
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import {
{%- if and .Table.TreePrimary .Table.TreeParent %}
    {{ moduleName }}Lists,
{%- endif %}
{{ moduleName }}Edit, {{ moduleName }}Add, {{ moduleName }}Detail } from '@/api/{{ moduleName }}'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import type { PropType } from 'vue'
defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
{%- if and .Table.TreePrimary .Table.TreeParent %}
const treeList = ref<any[]>([])
{%- endif %}
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑{{ functionName }}' : '新增{{ functionName }}'
})

const formData = reactive({
    {%- for column in columns %}
        {%- if column.javaField == primaryKey %}
            {{ primaryKey }}: '',
        {%- elif column.isEdit %}
            {%- if column.htmlType == "checkbox" %}
                {{ column.javaField }}: [],
            {%- elif column.htmlType == "number" %}
                {{ column.javaField }}: 0,
            {%- else %}
                {{ column.javaField }}: '',
            {%- endif %}
        {%- endif %}
    {%- endfor %}
})

const formRules = {
    {%- for column in columns %}
        {%- if and .column.isEdit .column.isRequired %}
            {{ column.javaField }}: [
                {
                    required: true,
                    {%- if column.htmlType == "checkbox" or column.htmlType == "datetime" or column.htmlType == "radio" or column.htmlType == "select" or column.htmlType == "imageUpload" %}
                        message: '请选择{{ column.columnComment }}',
                    {%- else %}
                        message: '请输入{{ column.columnComment }}',
                    {%- endif %}
                    trigger: ['blur']
                }
            ],
        {%- endif %}
    {%- endfor %}
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    const data: any = { ...formData }
    {%- for column in columns %}
        {%- if column.htmlType == "checkbox" %}
            data.{{ column.javaField }} = data.{{ column.javaField }}.join(',')
        {%- endif %}
    {%- endfor %}
    mode.value == 'edit' ? await {{ moduleName }}Edit(data) : await {{ moduleName }}Add(data)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (data: Record<string, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
            {%- for column in columns %}
                {%- if column.htmlType == "checkbox" %}
                    //@ts-ignore
                    formData.{{ column.javaField }} = String(data.{{ column.javaField }}).split(',')
                {%- endif %}
            {%- endfor %}
        }
    }
}

const getDetail = async (row: Record<string, any>) => {
    const data = await {{ moduleName }}Detail({
        {{ primaryKey }}: row.{{ primaryKey }}
    })
    setFormData(data)
}

const handleClose = () => {
    emit('close')
}
{%- if and .table.treePrimary .table.treeParent %}

const getLists = async () => {
    const data: any = await {{ moduleName }}Lists()
    const item = { {{ table.treePrimary }}: 0, {{ table.treeName }}: '顶级', children: [] }
    item.children = data
    treeList.value.push(item)
}

getLists()
{%- endif %}

defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
