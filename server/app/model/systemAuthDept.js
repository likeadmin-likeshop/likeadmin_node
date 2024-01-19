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
      comment: '主键',
    },
    pid: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '上级主键',
    },
    name: {
      type: STRING(100),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '部门名称',
    },
    duty: {
      type: STRING(30),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '负责人名',
    },
    mobile: {
      type: STRING(30),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '联系电话',
    },
    sort: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '排序编号',
    },
    isStop: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否禁用: 0=否, 1=是',
      field: 'is_stop',
    },
    isDelete: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否删除: 0=否, 1=是',
      field: 'is_delete',
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
    deleteTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '删除时间',
      field: 'delete_time',
      get() {
        const timestamp = this.getDataValue('deleteTime') * 1000;
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  };
  const SystemAuthDept = app.model.define('SystemAuthDept', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_system_auth_dept', // 定义实际表名
  });

  return SystemAuthDept;
};

