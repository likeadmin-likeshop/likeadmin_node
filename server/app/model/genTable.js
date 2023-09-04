const dayjs = require('dayjs')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)

module.exports = app => {
    const { STRING, INTEGER, SMALLINT, TEXT } = app.Sequelize

    const modelDefinition = {
        id: {
            type: INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        table_name: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        table_comment: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        sub_table_name: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        sub_table_fk: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        author_name: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        entity_name: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        module_name: {
            type: STRING(60),
            allowNull: false,
            defaultValue: '',
        },
        function_name: {
            type: STRING(60),
            allowNull: false,
            defaultValue: '',
        },
        tree_primary: {
            type: STRING(60),
            allowNull: false,
            defaultValue: '',
        },
        tree_parent: {
            type: STRING(60),
            allowNull: false,
            defaultValue: '',
        },
        tree_name: {
            type: STRING(60),
            allowNull: false,
            defaultValue: '',
        },
        gen_tpl: {
            type: STRING(20),
            allowNull: false,
            defaultValue: 'crud',
        },
        gen_type: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        gen_path: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '/',
        },
        remarks: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        create_time: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        update_time: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
    };
    const GenTable = app.model.define('GenTable', modelDefinition, {
        tableName: 'la_gen_table', // 定义实际表名
    })

    return GenTable
}

