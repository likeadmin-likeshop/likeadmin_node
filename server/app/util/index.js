//StructsToMaps 将结构体转换成Map列表
function structsToMaps(objs) {
    let objList = [];
    try {
        for (const obj of objs) {
            objList.push(JSON.parse(JSON.stringify(obj)));
        }
        const data = objList.map((obj) => {
            return obj;
        });
        return data;
    } catch (err) {
        this.ctx.logger.error(`convertUtil.structsToMaps err: err=[${err}]`);
        return null;
    }
}

//ListToTree 字典列表转树形结构
function listToTree(arr, id, pid, child) {
    const mapList = [];
    const idValMap = new Map();

    for (const m of arr) {
        if (m[id]) {
            idValMap.set(m[id], m);
        }
    }

    for (const m of arr) {
        if (m[pid]) {
            const pNode = idValMap.get(m[pid]);
            if (pNode) {
                let cVal = pNode[child];
                if (cVal === null || cVal === undefined) {
                    cVal = [m];
                } else {
                    cVal.push(m);
                }
                pNode[child] = cVal;
                continue;
            }
        }
        mapList.push(m);
    }

    return mapList;
}

// 导出公共方法
module.exports = {
    structsToMaps,
    listToTree
};