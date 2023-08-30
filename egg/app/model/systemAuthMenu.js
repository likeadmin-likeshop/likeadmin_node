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
        },
        pid: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        menu_type: {
            type: CHAR(2),
            allowNull: false,
            defaultValue: '',
        },
        menu_name: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        menu_icon: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        menu_sort: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        perms: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        paths: {
            type: STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        component: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        selected: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        params: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        is_cache: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        is_show: {
            type: SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
        },
        is_disable: {
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
    };
    const SystemAuthMenu = app.model.define('SystemAuthMenu', modelDefinition, {
        tableName: 'la_system_auth_menu', // 定义实际表名
    })

    return SystemAuthMenu
}

