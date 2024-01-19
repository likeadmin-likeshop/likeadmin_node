'use strict';

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
    adminId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '管理员ID',
      field: 'admin_id',
    },
    username: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '登录账号',
    },
    ip: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '登录地址',
    },
    os: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      comment: '操作系统',
    },
    browser: {
      type: STRING(100),
      allowNull: true,
      defaultValue: '',
      comment: '浏览器',
    },
    status: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '操作状态: 1=成功, 2=失败',
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '创建时间',
      field: 'create_time',
    },
  };
  const SystemLogLogin = app.model.define('SystemLogLogin', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_system_log_login', // 定义实际表名
    hooks: {
      beforeValidate: data => {
        const now = Math.floor(Date.now() / 1000);
        data.createTime = now;
      },
    },
  });

  return SystemLogLogin;
};

