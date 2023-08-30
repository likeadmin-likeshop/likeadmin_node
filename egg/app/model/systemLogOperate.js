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
            comment: '主键',
        },
        adminId: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '操作人ID',
        },
        type: {
            type: STRING(30),
            allowNull: false,
            defaultValue: '',
            comment: '请求类型: GET/POST/PUT',
        },
        title: {
            type: STRING(30),
            allowNull: true,
            defaultValue: '',
            comment: '操作标题',
        },
        ip: {
            type: STRING(30),
            allowNull: false,
            defaultValue: '',
            comment: '请求IP',
        },
        url: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
            comment: '请求接口',
        },
        method: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
            comment: '请求方法',
        },
        args: {
            type: TEXT,
            allowNull: true,
            comment: '请求参数',
        },
        error: {
            type: TEXT,
            allowNull: true,
            comment: '错误信息',
        },
        status: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
            comment: '执行状态: 1=成功, 2=失败',
        },
        startTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '开始时间',
        },
        endTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '结束时间',
        },
        taskTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '执行耗时',
        },
        createTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '创建时间',
        },
    };
    const SystemLogOperate = app.model.define('SystemLogOperate', modelDefinition, {
        tableName: 'la_system_log_operate', // 定义实际表名
    })

    return SystemLogOperate
}

