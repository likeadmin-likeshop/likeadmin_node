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
        userId: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        openid: {
            type: STRING(200),
            characterSet: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
        },
        unionid: {
            type: STRING(200),
            characterSet: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
        },
        client: {
            type: SMALLINT(1),
            unsigned: true,
            allowNull: false,
            defaultValue: 1,
        },
        createTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        updateTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
    };
    const UserAuth = app.model.define('UserAuth', modelDefinition, {
        tableName: 'la_user_auth', // 定义实际表名
    })

    return UserAuth
}

