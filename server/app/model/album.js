const dayjs = require('dayjs')
const {customAlphabet} = require('nanoid')
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)

/**
 * 相册管理表
 */
module.exports = app => {
    const {STRING, INTEGER, SMALLINT} = app.Sequelize

    const modelDefinition = {
        id: {
            type: INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        cid: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        aid: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        uid: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        type: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 10,
        },
        name: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        uri: {
            type: STRING(200),
            allowNull: false,
        },
        ext: {
            type: STRING(10),
            allowNull: false,
            defaultValue: '',
        },
        size: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        is_delete: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
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
        delete_time: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
    }
    const Album = app.model.define('Album', modelDefinition , {
        tableName: 'la_album', // 定义实际表名
    })

    return Album
}

