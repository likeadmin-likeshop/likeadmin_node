const dayjs = require('dayjs')
const {customAlphabet} = require('nanoid')
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)
const moment = require('moment');

/**
 * 相册分类表
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
        pid: {
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
            type: STRING(32),
            allowNull: false,
            defaultValue: '',
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
    const AlbumCate = app.model.define('AlbumCate', modelDefinition , {
        createdAt: false, // 指定名字
        updatedAt: false,
        tableName: 'la_album_cate', // 定义实际表名
    })

    return AlbumCate
}

