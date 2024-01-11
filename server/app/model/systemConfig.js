'use strict';

module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: '主键',
    },
    type: {
      type: STRING(30),
      allowNull: true,
      defaultValue: '',
      comment: '类型',
    },
    name: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: '键',
    },
    value: {
      type: TEXT,
      allowNull: true,
      comment: '值',
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: '创建时间',
      field: 'create_time',
    },
    updateTime: {
      type: INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: '更新时间',
      field: 'update_time',
    },
  };
  const SystemConfig = app.model.define('SystemConfig', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_system_config', // 定义实际表名
  });

  return SystemConfig;
};

