const dayjs = require('dayjs')
const {customAlphabet} = require('nanoid')
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)

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
    const AlbumCate = app.model.define('AlbumCate', modelDefinition , {
        tableName: 'la_album_cate', // 定义实际表名
    })

    return AlbumCate
}

