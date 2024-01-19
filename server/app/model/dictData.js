'use strict';

module.exports = app => {
  const { STRING, INTEGER, SMALLINT } = app.Sequelize;

  const modelDefinition = {
    id: {
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    typeId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'type_id',
    },
    name: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    value: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    remark: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
    },
    sort: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
    isDelete: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'is_delete',
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'create_time',
    },
    updateTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'update_time',
    },
    deleteTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'delete_time',
    },
  };
  const DictData = app.model.define('DictData', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_dict_data', // 定义实际表名
  });

  return DictData;
};

