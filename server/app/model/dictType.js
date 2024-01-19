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
    },
    dictName: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      field: 'dict_name',
    },
    dictType: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      field: 'dict_type',
    },
    dictRemark: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      field: 'dict_remark',
    },
    dictStatus: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      field: 'dict_status',
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
      get() {
        const timestamp = this.getDataValue('createTime') * 1000;
        return timestamp > 0 && moment(timestamp).format('YYYY-MM-DD HH:mm:ss') || '';
      },
    },
    updateTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'update_time',
      get() {
        const timestamp = this.getDataValue('updateTime') * 1000;
        return timestamp > 0 && moment(timestamp).format('YYYY-MM-DD HH:mm:ss') || '';
      },
    },
    deleteTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'delete_time',
      get() {
        const timestamp = this.getDataValue('deleteTime') * 1000;
        return timestamp > 0 && moment(timestamp).format('YYYY-MM-DD HH:mm:ss') || '';
      },
    },
  };
  const DictType = app.model.define('DictType', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_dict_type', // 定义实际表名
  });

  return DictType;
};

