'use strict';
const moment = require('moment');

module.exports = app => {
  const { STRING, INTEGER, SMALLINT, CHAR } = app.Sequelize;

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
    menuType: {
      type: CHAR(2),
      allowNull: false,
      defaultValue: '',
      field: 'menu_type',
    },
    menuName: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      field: 'menu_name',
    },
    menuIcon: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      field: 'menu_icon',
    },
    menuSort: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'menu_sort',
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
    isCache: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'is_cache',
    },
    isShow: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      field: 'is_show',
    },
    isDisable: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'is_disable',
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'create_time',
      get() {
        const timestamp = this.getDataValue('createTime') * 1000;
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updateTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'update_time',
      get() {
        const timestamp = this.getDataValue('updateTime') * 1000;
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  };
  const SystemAuthMenu = app.model.define('SystemAuthMenu', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_system_auth_menu', // 定义实际表名
  });

  return SystemAuthMenu;
};

