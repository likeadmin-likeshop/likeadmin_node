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
        user_id: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        article_id: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        is_delete: {
            type: SMALLINT.UNSIGNED,
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
    };
    const ArticleCollect = app.model.define('ArticleCollect', modelDefinition, {
        tableName: 'la_article_collect', // 定义实际表名
    })

    return ArticleCollect
}

