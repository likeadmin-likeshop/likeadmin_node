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
      comment: '列主键',
    },
    tableId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '表外键',
      field: 'table_id',
    },
    columnName: {
      type: STRING(200),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '列名称',
      field: 'column_name',
    },
    columnComment: {
      type: STRING(200),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '列描述',
      field: 'column_comment',
    },
    columnLength: {
      type: STRING(5),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: true,
      defaultValue: '0',
      comment: '列长度',
      field: 'column_length',
    },
    columnType: {
      type: STRING(100),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '列类型 ',
      field: 'column_type',
    },
    javaType: {
      type: STRING(100),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: 'JAVA类型',
      field: 'java_type',
    },
    javaField: {
      type: STRING(100),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: 'JAVA字段',
      field: 'java_field',
    },
    isPk: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否主键: [1=是, 0=否]',
      field: 'is_pk',
    },
    isIncrement: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否自增: [1=是, 0=否]',
      field: 'is_increment',
    },
    isRequired: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否必填: [1=是, 0=否]',
      field: 'is_required',
    },
    isInsert: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否插入字段: [1=是, 0=否]',
      field: 'is_insert',
    },
    isEdit: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否编辑字段: [1=是, 0=否]',
      field: 'is_edit',
    },
    isList: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否列表字段: [1=是, 0=否]',
      field: 'is_list',
    },
    isQuery: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否查询字段: [1=是, 0=否]',
      field: 'is_query',
    },
    queryType: {
      type: STRING(30),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: 'EQ',
      comment: '查询方式: [等于、不等于、大于、小于、范围]',
      field: 'query_type',
    },
    htmlType: {
      type: STRING(30),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '显示类型: [文本框、文本域、下拉框、复选框、单选框、日期控件]',
      field: 'html_type',
    },
    dictType: {
      type: STRING(200),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '字典类型',
      field: 'dict_type',
    },
    sort: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '排序编号',
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '创建时间',
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
      comment: '更新时间',
      field: 'update_time',
      get() {
        const timestamp = this.getDataValue('updateTime') * 1000;
        return timestamp > 0 && moment(timestamp).format('YYYY-MM-DD HH:mm:ss') || '';
      },
    },
  };
  const GenTableColumn = app.model.define('GenTableColumn', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_gen_table_column', // 定义实际表名
  });

  return GenTableColumn;
};

