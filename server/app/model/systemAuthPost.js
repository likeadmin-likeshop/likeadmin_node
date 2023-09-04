const dayjs = require('dayjs')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)

module.exports = app => {
    const { STRING, INTEGER, SMALLINT, TEXT, CHAR } = app.Sequelize

    const modelDefinition = {
        id: {
            type: INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            defaultValue: 0,
            comment: '主键',
        },
        code: {
            type: STRING(30),
            characterSet: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '岗位编码',
        },
        name: {
            type: STRING(30),
            characterSet: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '岗位名称',
        },
        remarks: {
            type: STRING(250),
            characterSet: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '岗位备注',
        },
        sort: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '岗位排序',
        },
        isStop: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否停用: 0=否, 1=是',
            field: 'is_stop',
        },
        isDelete: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '是否删除: 0=否, 1=是',
            field: 'is_delete',
        },
        createTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '创建时间',
            field: 'create_time',
        },
        updateTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '更新时间',
            field: 'update_time',
        },
        deleteTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '删除时间',
            field: 'delete_time',
        },
    };
    const SystemAuthPost = app.model.define('SystemAuthPost', modelDefinition, {
        createdAt: false, // 指定名字
        updatedAt: false,
        tableName: 'la_system_auth_post', // 定义实际表名
    })

    return SystemAuthPost
}

