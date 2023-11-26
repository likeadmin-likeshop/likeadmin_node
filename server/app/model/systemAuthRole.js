'use strict';
const moment = require('moment');

module.exports = app => {
  const { STRING, INTEGER, SMALLINT } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      defaultValue: 0,
      comment: '主键',
    },
    name: {
      type: STRING(100),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '角色名称',
    },
    remark: {
      type: STRING(200),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '备注信息',
    },
    sort: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '角色排序',
    },
    isDisable: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否禁用: 0=否, 1=是',
      field: 'is_disable',
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '创建时间',
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
      comment: '更新时间',
      field: 'update_time',
      get() {
        const timestamp = this.getDataValue('updateTime') * 1000;
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  };
  const SystemAuthRole = app.model.define('SystemAuthRole', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_system_auth_role', // 定义实际表名
  });

  return SystemAuthRole;
};

