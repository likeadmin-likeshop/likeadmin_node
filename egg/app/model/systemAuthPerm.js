const dayjs = require('dayjs')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)

module.exports = app => {
    const { STRING, INTEGER, SMALLINT, TEXT, CHAR } = app.Sequelize

    const modelDefinition = {
        id: {
            type: STRING(100),
            characterSet: 'utf8mb4',
            collation: 'utf8mb4_general_ci',
            allowNull: false,
            primaryKey: true,
            defaultValue: '',
        },
        role_id: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '角色ID',
        },
        menu_id: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: '菜单ID',
        },
    };
    const SystemAuthMenu = app.model.define('SystemAuthMenu', modelDefinition, {
        tableName: 'la_system_auth_menu', // 定义实际表名
    })

    return SystemAuthMenu
}

