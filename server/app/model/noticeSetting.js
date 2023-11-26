'use strict';

module.exports = app => {
  const { STRING, INTEGER, SMALLINT, TEXT } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: '场景编号',
    },
    scene: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '场景名称',
    },
    name: {
      type: STRING(100),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '场景描述',
    },
    remarks: {
      type: STRING(200),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '通知类型: [1=业务, 2=验证]',
    },
    recipient: {
      type: SMALLINT,
      allowNull: false,
      defaultValue: 1,
      comment: '接收人员: [1=用户, 2=平台]',
    },
    type: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '通知类型: [1=业务, 2=验证]',
    },
    system_notice: {
      type: TEXT,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      null: true,
      comment: '系统的通知设置',
    },
    sms_notice: {
      type: TEXT,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      null: true,
      comment: '短信的通知设置',
    },
    oa_notice: {
      type: TEXT,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      null: true,
      comment: '公众号通知设置',
    },
    mnp_notice: {
      type: TEXT,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      null: true,
      comment: '小程序通知设置',
    },
    is_delete: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否删除',
    },
    create_time: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '创建时间',
    },
    update_time: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '更新时间',
    },
    delete_time: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '删除时间',
    },
  };
  const NoticeSetting = app.model.define('NoticeSetting', modelDefinition, {
    tableName: 'la_notice_setting', // 定义实际表名
  });

  return NoticeSetting;
};

