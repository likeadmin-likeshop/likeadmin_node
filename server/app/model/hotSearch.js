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
            comment: '主键',
        },
        name: {
            type: STRING(200),
            charset: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            defaultValue: '',
            comment: '关键词',
        },
        sort: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '排序号',
        },
    };
    const HotSearch = app.model.define('HotSearch', modelDefinition, {
        tableName: 'la_hot_search', // 定义实际表名
    })

    return HotSearch
}

