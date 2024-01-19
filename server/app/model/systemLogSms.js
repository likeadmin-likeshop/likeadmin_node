'use strict';

module.exports = app => {
  const { STRING, INTEGER, SMALLINT, TEXT } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: 'id',
    },
    scene: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '场景编号',
    },
    mobile: {
      type: STRING(11),
      allowNull: false,
      defaultValue: '',
      comment: '手机号码',
    },
    content: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
      comment: '发送内容',
    },
    status: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '发送状态：[0=发送中, 1=发送成功, 2=发送失败]',
    },
    results: {
      type: TEXT,
      allowNull: true,
      comment: '短信结果',
    },
    sendTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '发送时间',
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '创建时间',
    },
    updateTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '更新时间',
    },
  };
  const SystemLogSms = app.model.define('SystemLogSms', modelDefinition, {
    tableName: 'la_system_log_sms', // 定义实际表名
  });

  return SystemLogSms;
};

