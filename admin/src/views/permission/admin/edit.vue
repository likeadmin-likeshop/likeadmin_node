<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="84px" :rules="formRules">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="formData.username" :disabled="isRoot" placeholder="请输入账号" clearable />
                </el-form-item>
                <el-form-item label="头像">
                    <div>
                        <div>
                            <material-picker v-model="formData.avatar" :limit="1" />
                        </div>
                        <div class="form-tips">建议尺寸：100*100px，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>
                <el-form-item label="名称" prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请输入名称" clearable />
                </el-form-item>
                <el-form-item label="归属部门" prop="deptId">
                    <el-tree-select class="flex-1" v-model="formData.deptId" :data="optionsData.dept" clearable
                        node-key="id" :props="{
                            value: 'id',
                            label: 'name',
                            disabled(data: any) {
                                return !!data.isStop
                            }
                        }" check-strictly :default-expand-all="true" placeholder="请选择上级部门" />
                </el-form-item>
                <el-form-item label="岗位" prop="postId">
                    <el-select class="flex-1" clearable v-model="formData.postId" placeholder="请选择岗位">
                        <el-option v-for="(item, index) in optionsData.post" :key="index" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="角色" prop="role">
                    <el-select v-model="formData.role" :disabled="isRoot" class="flex-1" clearable placeholder="请选择角色"
                        multiple>
                        <el-option v-if="isRoot" label="系统管理员" :value="0" />
                        <el-option v-for="(item, index) in optionsData.role" :key="index" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model.trim="formData.password" show-password clearable placeholder="请输入密码" />
                </el-form-item>

                <el-form-item label="确认密码" prop="passwordConfirm">
                    <el-input v-model.trim="formData.passwordConfirm" show-password clearable placeholder="请输入确认密码" />
                </el-form-item>

                <el-form-item label="管理员状态" v-if="!isRoot">
                    <el-switch v-model="formData.isDisable" :active-value="0" :inactive-value="1" />
                </el-form-item>

                <el-form-item label="多处登录">
                    <div>
                        <el-switch v-model="formData.isMultipoint" :active-value="1" :inactive-value="0" />
                        <div class="form-tips">允许多人同时在线登录</div>
                    </div>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { adminAdd, adminEdit, adminDetail } from '@/api/perms/admin'
import { useDictOptions } from '@/hooks/useDictOptions'
import { roleAll } from '@/api/perms/role'
import { postAll } from '@/api/org/post'
import { deptLists } from '@/api/org/department'
import feedback from '@/utils/feedback'
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑管理员' : '新增管理员'
})

const formData = reactive({
    id: '',
    username: '',
    nickname: '',
    deptId: '',
    postId: '',
    role: '',
    avatar: '',
    password: '',
    passwordConfirm: '',
    isDisable: 0,
    isMultipoint: 1,
    //服务端为必传参数，先给默认值
    sort: 1
})

const isRoot = computed(() => {
    return formData.role == '0'
})

const passwordConfirmValidator = (rule: object, value: string, callback: any) => {
    if (formData.password) {
        if (!value) callback(new Error('请再次输入密码'))
        if (value !== formData.password) callback(new Error('两次输入密码不一致!'))
    }
    callback()
}
const formRules = reactive({
    username: [
        {
            required: true,
            message: '请输入账号',
            trigger: ['blur']
        }
    ],
    nickname: [
        {
            required: true,
            message: '请输入名称',
            trigger: ['blur']
        }
    ],
    role: [
        {
            required: true,
            message: '请选择角色',
            trigger: ['blur']
        }
    ],
    deptId: [
        {
            required: true,
            message: '请输入名称',
            trigger: ['blur']
        }
    ],
    postId: [
        {
            required: true,
            message: '请输入名称',
            trigger: ['blur']
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        }
    ] as any[],
    passwordConfirm: [
        {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
        },
        {
            validator: passwordConfirmValidator,
            trigger: 'blur'
        }
    ] as any[]
})

const { optionsData } = useDictOptions<{
    role: any[]
    post: any[]
    dept: any[]
}>({
    role: {
        api: roleAll
    },
    post: {
        api: postAll
    },
    dept: {
        api: deptLists
    }
})

const handleSubmit = async () => {
    await formRef.value?.validate()
    mode.value == 'edit' ? await adminEdit(formData) : await adminAdd(formData)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (row: any) => {
    const data = await adminDetail({
        id: row.id
    })
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //后端返回string类型做处理
            if (key === 'role') {
                //@ts-ignore
                // formData[key] = Number(data[key])
                const arr = data[key].split(',').map(char => Number(char));
                formData[key] = arr
                return
            }
            //@ts-ignore
            formData[key] = data[key]
        }
        Number(formData.deptId) == 0 && (formData.deptId = '')
        Number(formData.postId) == 0 && (formData.postId = '')
    }
    formRules.password = []
    formRules.passwordConfirm = [
        {
            validator: passwordConfirmValidator,
            trigger: 'blur'
        }
    ]
}

const handleClose = () => {
    emit('close')
}

defineExpose({
    open,
    setFormData
})
</script>
