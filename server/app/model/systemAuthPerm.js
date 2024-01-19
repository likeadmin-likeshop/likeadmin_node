'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: STRING(100),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      primaryKey: true,
      defaultValue: '',
    },
    roleId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '角色ID',
      field: 'role_id',
    },
    menuId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '菜单ID',
      field: 'menu_id',
    },
  };
  const SystemAuthPerm = app.model.define('SystemAuthPerm', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_system_auth_perm', // 定义实际表名
  });

  return SystemAuthPerm;
};

