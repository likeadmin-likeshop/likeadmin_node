const moment = require('moment');

/**
 * {{ toPascalCase(entityName) }} {{ functionName }}实体
 */
module.exports = app => {
    const {STRING, INTEGER, SMALLINT} = app.Sequelize

    const modelDefinition = {
        {%- for column in columns %}
        {{ toCamelCase(column.columnName) }}: {
            type: {{ column.javaType }},
            autoIncrement: true,
            allowNull: false,
            field: '{{ column.javaField }}',
        },
        {%- endfor %}
    }
    const {{ toPascalCase(entityName) }} = app.model.define('{{ toPascalCase(entityName) }}', modelDefinition , {
        createdAt: false, // 指定名字
        updatedAt: false,
        tableName: '{{ tableName }}', // 定义实际表名
    })

    return {{ toPascalCase(entityName) }}
}
