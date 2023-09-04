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
        dict_name: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        dict_type: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        dict_remark: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        dict_status: {
            type: SMALLINT.UNSIGNED,
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
    const DictType = app.model.define('DictType', modelDefinition, {
        tableName: 'la_dict_type', // 定义实际表名
    })

    return DictType
}

