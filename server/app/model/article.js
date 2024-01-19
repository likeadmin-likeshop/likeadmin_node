'use strict';

module.exports = app => {
  const { STRING, INTEGER, SMALLINT, TEXT } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cid: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    title: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    intro: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    summary: {
      type: STRING(200),
      allowNull: true,
      defaultValue: '',
    },
    image: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    content: {
      type: TEXT,
      allowNull: false,
    },
    author: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    visit: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    sort: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 50,
    },
    is_show: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    is_delete: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    create_time: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    update_time: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    delete_time: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  };
  const Article = app.model.define('Article', modelDefinition, {
    tableName: 'la_article', // 定义实际表名
  });

  return Article;
};

