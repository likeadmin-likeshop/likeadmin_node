'use strict';

module.exports = app => {
  const { STRING, INTEGER, SMALLINT, TEXT } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: '主键',
    },
    name: {
      type: STRING(64),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '规则名',
    },
    keyword: {
      type: STRING(64),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '关键词',
    },
    reply_type: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '回复类型: [1=关注回复 2=关键字回复, 3=默认回复]',
    },
    matching_type: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '匹配方式: [1=全匹配, 2=模糊匹配]',
    },
    content_type: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '内容类型: [1=文本]',
    },
    status: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '启动状态: [1=启动, 0=关闭]',
    },
    content: {
      type: TEXT,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      comment: '回复内容',
    },
    sort: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 50,
      comment: '排序编号',
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
  const OfficialReply = app.model.define('OfficialReply', modelDefinition, {
    tableName: 'la_official_reply', // 定义实际表名
  });

  return OfficialReply;
};

