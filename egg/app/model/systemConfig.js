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
        type: {
            type: STRING(30),
            allowNull: true,
            defaultValue: '',
            comment: '类型',
        },
        name: {
            type: STRING(60),
            allowNull: false,
            defaultValue: '',
            comment: '键',
        },
        value: {
            type: TEXT,
            allowNull: true,
            comment: '值',
        },
        createTime: {
            type: INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 0,
            comment: '创建时间',
        },
        updateTime: {
            type: INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 0,
            comment: '更新时间',
        },
    };
    const SystemConfig = app.model.define('SystemConfig', modelDefinition, {
        tableName: 'la_system_config', // 定义实际表名
    })

    return SystemConfig
}

