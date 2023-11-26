'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: STRING(20),
      allowNull: false,
      defaultValue: '',
    },
    selected: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    unselected: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    link: {
      type: STRING(200),
      allowNull: false,
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
  const DecorateTabbar = app.model.define('DecorateTabbar', modelDefinition, {
    tableName: 'la_decorate_tabbar', // 定义实际表名
  });

  return DecorateTabbar;
};

