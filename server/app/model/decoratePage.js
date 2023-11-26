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
    page_type: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 10,
    },
    page_name: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    page_data: {
      type: TEXT,
      allowNull: true,
      defaultValue: '',
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
  };
  const DecoratePage = app.model.define('DecoratePage', modelDefinition, {
    tableName: 'la_decorate_page', // 定义实际表名
  });

  return DecoratePage;
};

