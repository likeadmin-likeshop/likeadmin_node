import request from '@/utils/request'

// {{functionName}}列表
export function {{moduleName}}Lists(params?: Record<string, any>) {
    return request.get({ url: '/{{moduleName}}/list', params })
}

// {{functionName}}详情
export function {{moduleName}}Detail(params: Record<string, any>) {
    return request.get({ url: '/{{moduleName}}/detail', params })
}

// {{functionName}}新增
export function {{moduleName}}Add(params: Record<string, any>) {
    return request.post({ url: '/{{moduleName}}/add', params })
}

// {{functionName}}编辑
export function {{moduleName}}Edit(params: Record<string, any>) {
    return request.post({ url: '/{{moduleName}}/edit', params })
}

// {{functionName}}删除
export function {{moduleName}}Delete(params: Record<string, any>) {
    return request.post({ url: '/{{moduleName}}/del', params })
}
