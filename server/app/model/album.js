const dayjs = require('dayjs')
const {customAlphabet} = require('nanoid')
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)
const moment = require('moment');

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
        isDelete: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            field: 'is_delete',
        },
        createTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            field: 'create_time',
            get() {
                const timestamp = this.getDataValue('createTime') * 1000;
                return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updateTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            field: 'update_time',
            get() {
                const timestamp = this.getDataValue('updateTime') * 1000;
                return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        deleteTime: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            field: 'delete_time',
            get() {
                const timestamp = this.getDataValue('deleteTime') * 1000;
                return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    }
    const Album = app.model.define('Album', modelDefinition , {
        createdAt: false, // 指定名字
        updatedAt: false,
        tableName: 'la_album', // 定义实际表名
    })

    return Album
}

