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
    sn: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    avatar: {
      type: STRING(200),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
    },
    realName: {
      type: STRING(32),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
    },
    nickname: {
      type: STRING(32),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
    },
    username: {
      type: STRING(32),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
    },
    password: {
      type: STRING(32),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
    },
    mobile: {
      type: STRING(32),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
    },
    salt: {
      type: STRING(32),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
    },
    sex: {
      type: SMALLINT,
      unsigned: true,
      allowNull: false,
      defaultValue: 0,
    },
    channel: {
      type: SMALLINT,
      unsigned: true,
      allowNull: false,
      defaultValue: 0,
    },
    isDisable: {
      type: SMALLINT,
      unsigned: true,
      allowNull: false,
      defaultValue: 0,
    },
    isDelete: {
      type: SMALLINT,
      unsigned: true,
      allowNull: false,
      defaultValue: 0,
    },
    lastLoginIp: {
      type: STRING(30),
      characterSet: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      allowNull: false,
      defaultValue: '',
    },
    lastLoginTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    createTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    updateTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    deleteTime: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  };
  const User = app.model.define('User', modelDefinition, {
    tableName: 'la_user', // 定义实际表名
  });

  return User;
};

