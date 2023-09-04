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
            comment: '列主键',
        },
        table_id: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '表外键',
        },
        column_name: {
            type: STRING(200),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '列名称',
        },
        column_comment: {
            type: STRING(200),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '列描述',
        },
        column_length: {
            type: STRING(5),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: true,
            defaultValue: '0',
            comment: '列长度',
        },
        column_type: {
            type: STRING(100),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '列类型 ',
        },
        java_type: {
            type: STRING(100),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: 'JAVA类型',
        },
        java_field: {
            type: STRING(100),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: 'JAVA字段',
        },
        is_pk: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否主键: [1=是, 0=否]',
        },
        is_increment: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否自增: [1=是, 0=否]',
        },
        is_required: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否必填: [1=是, 0=否]',
        },
        is_insert: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否插入字段: [1=是, 0=否]',
        },
        is_edit: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否编辑字段: [1=是, 0=否]',
        },
        is_list: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否列表字段: [1=是, 0=否]',
        },
        is_query: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否查询字段: [1=是, 0=否]',
        },
        query_type: {
            type: STRING(30),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: 'EQ',
            comment: '查询方式: [等于、不等于、大于、小于、范围]',
        },
        html_type: {
            type: STRING(30),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '显示类型: [文本框、文本域、下拉框、复选框、单选框、日期控件]',
        },
        dict_type: {
            type: STRING(200),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '字典类型',
        },
        sort: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '排序编号',
        },
        create_time: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '创建时间',
        },
        update_time: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '更新时间',
        },
    };
    const GenTableColumn = app.model.define('GenTableColumn', modelDefinition, {
        tableName: 'la_gen_table_column', // 定义实际表名
    })

    return GenTableColumn
}

