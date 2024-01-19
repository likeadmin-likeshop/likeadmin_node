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
    tableName: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      field: 'table_name',
    },
    tableComment: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      field: 'table_comment',
    },
    subTableName: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      field: 'sub_table_name',
    },
    subTableFk: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      field: 'sub_table_fk',
    },
    authorName: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      field: 'author_name',
    },
    entityName: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      field: 'entity_name',
    },
    moduleName: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      field: 'module_name',
    },
    functionName: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      field: 'function_name',
    },
    treePrimary: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      field: 'tree_primary',
    },
    treeParent: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      field: 'tree_parent',
    },
    treeName: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      field: 'tree_name',
    },
    genTpl: {
      type: STRING(20),
      allowNull: false,
      defaultValue: 'crud',
      field: 'gen_tpl',
    },
    genType: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'gen_type',
    },
    genPath: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '/',
      field: 'gen_path',
    },
    remarks: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
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
  };
  const GenTable = app.model.define('GenTable', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_gen_table', // 定义实际表名
  });

  return GenTable;
};

