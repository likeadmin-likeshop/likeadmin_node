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
      comment: '主键',
    },
    deptId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '部门ID',
      field: 'dept_id',
    },
    postId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '岗位ID',
      field: 'post_id',
    },
    username: {
      type: STRING(32),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '用户账号',
    },
    nickname: {
      type: STRING(32),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '用户昵称',
    },
    password: {
      type: STRING(200),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '用户密码',
    },
    avatar: {
      type: STRING(200),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '用户头像',
    },
    role: {
      type: STRING(200),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '角色主键',
    },
    salt: {
      type: STRING(20),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '加密盐巴',
    },
    sort: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '排序编号',
    },
    isMultipoint: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '多端登录: 0=否, 1=是',
      field: 'is_multipoint',
    },
    isDisable: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否禁用: 0=否, 1=是',
      field: 'is_disable',
    },
    isDelete: {
      type: SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否删除: 0=否, 1=是',
      field: 'is_delete',
    },
    lastLoginIp: {
      type: STRING(20),
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
      comment: '最后登录IP',
      field: 'last_login_ip',
    },
    lastLoginTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '最后登录',
      field: 'last_login_time',
      get() {
        const timestamp = this.getDataValue('lastLoginTime') * 1000;
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '创建时间',
      field: 'create_time',
      get() {
        const timestamp = this.getDataValue('createTime') * 1000;
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
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
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    deleteTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '删除时间',
      field: 'delete_time',
      get() {
        const timestamp = this.getDataValue('deleteTime') * 1000;
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  };
  const SystemAuthAdmin = app.model.define('SystemAuthAdmin', modelDefinition, {
    createdAt: false, // 指定名字
    updatedAt: false,
    tableName: 'la_system_auth_admin', // 定义实际表名
  });

  SystemAuthAdmin.associate = function() {
    // SystemAuthRole 表建立多对一关系
    app.model.SystemAuthAdmin.belongsTo(app.model.SystemAuthRole, {
      foreignKey: 'role', as: 'authRole',
    });
    // SystemAuthDept 表建立多对一关系
    app.model.SystemAuthAdmin.belongsTo(app.model.SystemAuthDept, {
      foreignKey: 'deptId', as: 'dept',
    });
  };

  return SystemAuthAdmin;
};

