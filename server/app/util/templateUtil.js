const { genConfig, sqlConstants, genConstants, rootPath } = require('../extend/config')
const stringUtil = require('../util/stringUtil');
const basePath = "generator/templates";
const path = require('path');
const nunjucks = require('nunjucks');
const util = require('../util');


//PrepareVars 获取模板变量信息
function prepareVars(table, columns, oriSubPriCol, oriSubCols) {
    let subPriField = "id";
    let isSearch = false;
    let primaryKey = "id";
    let primaryField = "id";
    let functionName = "【请填写功能名称】";
    let allFields = [];
    let subTableFields = [];
    let listFields = [];
    let detailFields = [];
    let dictFields = [];
    let subColumns = [];
    let oriSubColNames = oriSubCols?.map(column => column.columnName);

    if (oriSubPriCol.id > 0) {
        subPriField = oriSubPriCol.columnName;
        subColumns.push(oriSubPriCol);
    }

    for (const column of columns) {
        allFields.push(column.columnName);

        if (oriSubColNames.includes(column.columnName)) {
            subTableFields.push(column.columnName);
            subColumns.push(column);
        }

        if (column.isList === 1) {
            listFields.push(column.columnName);
        }

        if (column.isEdit === 1) {
            detailFields.push(column.columnName);
        }

        if (column.isQuery === 1) {
            isSearch = true;
        }

        if (column.isPk === 1) {
            primaryKey = column.javaField;
            primaryField = column.columnName;
        }

        if (column.dictType && !dictFields.includes(column.dictType)) {
            dictFields.push(column.dictType);
        }
    }

    const modelOprMap = {
        "=": "==",
        "LIKE": "like",
    };

    if (table.functionName) {
        functionName = table.functionName;
    }

    return {
        genTpl: table.genTpl,
        tableName: table.tableName,
        authorName: table.authorName,
        packageName: genConfig.packageName,
        entityName: table.entityName,
        entitySnakeName: stringUtil.toSnakeCase(table.entityName),
        moduleName: table.moduleName,
        functionName: functionName,
        dateFields: sqlConstants.ColumnTimeName,
        primaryKey: primaryKey,
        primaryField: primaryField,
        allFields: allFields,
        subPriCol: oriSubPriCol,
        subPriField: subPriField,
        subTableFields: subTableFields,
        listFields: listFields,
        detailFields: detailFields,
        dictFields: dictFields,
        isSearch: isSearch,
        modelOprMap: modelOprMap,
        columns: columns,
        subColumns: subColumns,
    };
}

//GetTemplatePaths 获取模板路径
function getTemplatePaths(genTpl) {
    let tplPaths = [
        'gocode/model.go.tpl',
        'gocode/service.go.tpl',
        'gocode/controller.go.tpl',
        'gocode/route.go.tpl',
        // 'vue/api.ts.tpl',
        // 'vue/edit.vue.tpl',
    ];

    if (genTpl === genConstants.TplCrud) {
        tplPaths.push('vue/index.vue.tpl');
    } else if (genTpl === genConstants.TplTree) {
        tplPaths.push('vue/index-tree.vue.tpl');
    }

    return tplPaths;
}

async function render(tplPath, tplVars) {
    const env = nunjucks.configure({ autoescape: true });
    env.addGlobal('toCamelCase', util.toCamelCase);
    env.addGlobal('toPascalCase', util.toPascalCase);

    console.log(path.join(rootPath, basePath, tplPath), 'path.join(rootPath, basePath, tplPath)....')
    console.log(tplVars, 'tplVars.......')
    const tpl = await nunjucks.render(path.join(rootPath, basePath, tplPath), tplVars);
    return tpl;
}

// 将JavaScript方法封装为Nunjucks过滤器
// nunjucks.configure({ autoescape: true });
// nunjucks.addFilter('toCamelCase', function (name) {
//     return util.toCamelCase(name);
// });


module.exports = {
    prepareVars,
    getTemplatePaths,
    render,
};
