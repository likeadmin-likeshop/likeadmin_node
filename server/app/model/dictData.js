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
        type_id: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        name: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        value: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        remark: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        sort: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: SMALLINT,
            allowNull: false,
            defaultValue: 1,
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
    const DictData = app.model.define('DictData', modelDefinition, {
        tableName: 'la_dict_data', // 定义实际表名
    })

    return DictData
}

