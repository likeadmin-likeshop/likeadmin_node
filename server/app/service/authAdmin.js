'use strict';

const Service = require('egg').Service;
const { backstageManageKey, backstageRolesKey, reqAdminIdKey, superAdminId, backstageTokenKey, backstageTokenSet } = require('../extend/config');
const parser = require('ua-parser-js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const util = require('../util');
const urlUtil = require('../util/urlUtil');
const md5 = require('md5');

class AuthAdminService extends Service {
  async cacheAdminUserByUid(id) {
    const { ctx } = this;
    const admin = await ctx.model.SystemAuthAdmin.findOne({
      where: {
        id,
      },
    });
    if (!admin) {
      return;
    }
    const str = await JSON.stringify(admin);
    if (!str) {
      return;
    }
    await ctx.service.redis.hSet(backstageManageKey, parseInt(admin.id, 10), str, 0);
  }

  async cacheRoleMenusByRoleId(roleId) {
    const { ctx } = this;
    try {
      const perms = await ctx.model.SystemAuthPerm.findAll({
        where: {
          roleId,
        },
      });

      const menuIds = perms.map(perm => perm.menuId);

      const menus = await ctx.model.SystemAuthMenu.findAll({
        where: {
          isDisable: 0,
          id: {
            [Op.in]: menuIds,
          },
          menuType: {
            [Op.in]: [ 'C', 'A' ],
          },
        },
        order: [
          [ 'menuSort', 'ASC' ],
          [ 'id', 'ASC' ],
        ],
      });

      const menuArray = menus
        .filter(menu => menu.perms !== '')
        .map(menu => menu.perms.trim());

      const redisKey = backstageRolesKey;
      const roleIdStr = String(roleId);
      const menuString = menuArray.join(',');

      await ctx.service.redis.hSet(redisKey, roleIdStr, menuString, 0);

      return menuArray;
    } catch (err) {
      throw new Error('CacheRoleMenusByRoleId error:' + err);
    }
  }

  // SelectMenuIdsByRoleId 根据角色ID获取菜单ID
  async selectMenuIdsByRoleId(roleId) {
    const { ctx } = this;
    const systemAuthRole = ctx.model.SystemAuthRole;
    const systemAuthPerm = ctx.model.SystemAuthPerm;
    try {
      const role = await systemAuthRole.findOne({
        where: {
          id: roleId,
          isDisable: 0,
        },
      });
      if (!role) {
        return [];
      }

      const perms = await systemAuthPerm.findAll({
        where: {
          roleId: role.id,
        },
      });

      const menuIds = perms.map(perm => perm.menuId);
      return menuIds;
    } catch (err) {
      throw new Error('SelectMenuIdsByRoleId error:' + err);
    }
  }

  // SelectMenuByRoleId 根据角色ID获取菜单
  async selectMenuByRoleId(roleId) {
    const { ctx } = this;
    const adminId = ctx.session[reqAdminIdKey];
    let menuIds = await this.selectMenuIdsByRoleId(roleId);
    if (!menuIds || menuIds.length === 0) {
      menuIds = [ 0 ];
    }
    let chain = ctx.model.SystemAuthMenu
      .findAll({
        where: {
          menuType: [ 'M', 'C' ],
          isDisable: 0,
        },
        order: [[ 'menuSort', 'DESC' ], [ 'id' ]],
      });
    if (adminId !== superAdminId) {
      chain = chain.where({
        id: menuIds,
      });
    }
    const menus = await chain;
    const menuResps = menus.map(menu => menu.toJSON());
    const mapList = util.listToTree(
      util.structsToMaps(menuResps),
      'id',
      'pid',
      'children'
    );
    return mapList;
  }

  // BatchSaveByMenuIds 批量写入角色菜单
  async batchSaveByMenuIds(roleId, menuIds, transaction) {
    const { ctx } = this;

    if (!menuIds) {
      return;
    }

    const menuIdArray = menuIds.split(',');

    const perms = menuIdArray.map(menuIdStr => ({
      id: util.makeUuid(),
      roleId,
      menuId: parseInt(menuIdStr, 10),
    }));

    try {
      await ctx.model.SystemAuthPerm.bulkCreate(perms, { transaction });
    } catch (err) {
      throw new Error('BatchSaveByMenuIds Create in tx err');
    }
  }

  // BatchDeleteByRoleId 批量删除角色菜单(根据角色ID)
  async batchDeleteByRoleId(roleId, transaction) {
    const { ctx } = this;

    const options = {
      where: {
        roleId,
      },
    };

    if (transaction) {
      options.transaction = transaction;
    }

    try {
      await ctx.model.SystemAuthPerm.destroy(options);
    } catch (err) {
      throw new Error('BatchDeleteByRoleId Delete err');
    }
  }

  async recordLoginLog(adminId, username, errStr) {
    const { ctx } = this;
    const ua = parser(ctx.request.header['user-agent']);
    let status = 0;
    if (!errStr) {
      status = 1;
    }
    try {
      const params = {
        adminId,
        username,
        ip: ctx.request.ip,
        os: JSON.stringify(ua.os),
        browser: JSON.stringify(ua.browser),
        status,
      };
      const result = await ctx.model.SystemLogLogin.create({
        ...params,
      });
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async adminList(listReq) {
    const { ctx } = this;
    const { SystemAuthAdmin, SystemAuthDept } = ctx.model;

    try {
      const limit = parseInt(listReq.pageSize, 10);
      const offset = listReq.pageSize * (listReq.pageNo - 1);

      const username = listReq.username || '';
      const nickname = listReq.nickname || '';

      const where = {};
      if (listReq.role) {
        where.role = listReq.role;
      }

      const adminModel = await SystemAuthAdmin.findAndCountAll({
        where: {
          isDelete: 0,
          username: { [Op.like]: `%${username}%` },
          nickname: { [Op.like]: `%${nickname}%` },
          ...where,
        },
        include: [
          { model: SystemAuthDept, as: 'dept', attributes: [ 'name' ] },
        ],
        limit,
        offset,
        order: [[ 'id', 'DESC' ], [ 'sort', 'DESC' ]],
        attributes: { exclude: [ 'password', 'salt', 'deleteTime', 'isDelete', 'sort' ] }, // 排除该字段显示
      });

      const [ adminResp, count ] = await Promise.all([
        adminModel.rows.map(admin => admin.toJSON()),
        adminModel.count,
      ]);

      for (let i = 0; i < adminResp.length; i++) {
        adminResp[i].avatar = urlUtil.toAbsoluteUrl(adminResp[i].avatar);
        adminResp[i].dept = adminResp[i].dept.name;
        if (adminResp[i].id === 1) {
          adminResp[i].role = '系统管理员';
          delete adminResp[i].authRole;
        } else {
          const roleIds = adminResp[i].role.split(',');
          const role = await ctx.model.SystemAuthRole.findAll({
            where: {
              id: roleIds,
            },
            attributes: [ 'name' ],
          });
          const rows = role.map(items => items.name);
          adminResp[i].role = rows;
        }
      }

      return {
        pageNo: listReq.pageNo,
        pageSize: listReq.pageSize,
        count,
        lists: adminResp,
      };
    } catch (err) {
      throw new Error('List Find err');
    }
  }

  async detail(id) {
    const { ctx } = this;
    const { SystemAuthAdmin } = ctx.model;

    try {
      const sysAdmin = await SystemAuthAdmin.findOne({
        where: {
          id,
          isDelete: 0,
        },
        attributes: { exclude: [ 'password', 'salt', 'deleteTime', 'isDelete', 'sort' ] },
      });

      if (!sysAdmin) {
        throw new Error('账号已不存在！');
      }

      const res = sysAdmin.toJSON();

      res.avatar = urlUtil.toAbsoluteUrl(res.avatar);

      if (!res.dept) {
        res.dept = String(res.deptId);
      }

      return res;
    } catch (err) {
      throw new Error('Get Admin Detail error');
    }
  }

  async add(addReq) {
    const { ctx } = this;
    const { SystemAuthAdmin, SystemAuthRole } = ctx.model;
    delete addReq.id;

    try {
      let sysAdmin = await SystemAuthAdmin.findOne({
        where: {
          username: addReq.username,
          isDelete: 0,
        },
      });

      if (sysAdmin) {
        throw new Error('账号已存在换一个吧！');
      }

      sysAdmin = await SystemAuthAdmin.findOne({
        where: {
          nickname: addReq.nickname,
          isDelete: 0,
        },
      });

      if (sysAdmin) {
        throw new Error('昵称已存在换一个吧！');
      }

      const roles = addReq.role; // 角色数组

      const roleResps = await SystemAuthRole.findAll({
        where: {
          id: roles,
          isDisable: 0,
        },
      });

      if (roleResps.length === 0) {
        throw new Error('当前角色已被禁用!');
      }

      const passwdLen = addReq.password.length;

      if (!(passwdLen >= 6 && passwdLen <= 20)) {
        throw new Error('密码必须在6~20位');
      }

      const salt = util.randomString(5);

      sysAdmin = new SystemAuthAdmin();
      const dateTime = Math.floor(Date.now() / 1000);
      const timeObject = {
        createTime: dateTime,
        updateTime: dateTime,
      };

      Object.assign(sysAdmin, addReq, timeObject);

      sysAdmin.role = String(addReq.role);
      sysAdmin.salt = salt;
      sysAdmin.password = md5(addReq.password.trim() + salt);

      if (!addReq.avatar) {
        addReq.avatar = '/public/static/backend_avatar.png';
      } else {
        addReq.avatar = urlUtil.toRelativeUrl(addReq.avatar);
      }

      sysAdmin.avatar = addReq.avatar;

      await sysAdmin.save();

      return;
    } catch (err) {
      throw new Error('Add Admin error');
    }
  }

  async edit(editReq) {
    const { ctx } = this;
    const { redis } = this.app;
    const { SystemAuthAdmin, SystemAuthRole } = ctx.model;

    try {
      const admin = await SystemAuthAdmin.findByPk(editReq.id);

      if (!admin || admin.isDelete) {
        throw new Error('账号不存在了!');
      }

      let sysAdmin = await SystemAuthAdmin.findOne({
        where: {
          username: editReq.username,
          isDelete: 0,
          id: {
            [Op.ne]: editReq.id,
          },
        },
      });

      if (sysAdmin) {
        throw new Error('账号已存在换一个吧！');
      }

      sysAdmin = await SystemAuthAdmin.findOne({
        where: {
          nickname: editReq.nickname,
          isDelete: 0,
          id: {
            [Op.ne]: editReq.id,
          },
        },
      });

      if (sysAdmin) {
        throw new Error('昵称已存在换一个吧！');
      }

      if (editReq.role > 0 && editReq.id !== 1) {

        const roleResps = await SystemAuthRole.findAll({
          where: {
            id: editReq.role,
          },
        });

        if (roleResps.length === 0) {
          throw new Error('角色不存在!');
        }
      }

      if (!editReq.avatar) {
        editReq.avatar = '/public/static/backend_avatar.png';
      } else {
        editReq.avatar = urlUtil.toRelativeUrl(editReq.avatar);
      }

      const adminMap = {
        ...editReq,
      };

      const role = editReq.role > 0 && editReq.id !== 1 ? editReq.role : 0;

      adminMap.role = String(role);

      if (editReq.id === 1) {
        delete adminMap.username;
      }

      if (editReq.password) {
        const passwdLen = editReq.password.length;

        if (!(passwdLen >= 6 && passwdLen <= 20)) {
          throw new Error('密码必须在6~20位');
        }

        const salt = util.randomString(5);

        adminMap.salt = salt;
        adminMap.password = md5(editReq.password.trim() + salt);
      } else {
        delete adminMap.password;
      }

      await admin.update(adminMap);

      this.cacheAdminUserByUid(editReq.id);

      const adminId = ctx.session[reqAdminIdKey];

      if (editReq.password && editReq.id === adminId) {
        const token = ctx.request.header.token;

        await ctx.service.redis.del(backstageTokenKey + token);

        const adminSetKey = backstageTokenSet + String(adminId);

        const ts = await redis.smembers(adminSetKey);

        if (ts.length > 0) {
          const tokenKeys = ts.map(t => backstageTokenKey + t);

          await ctx.service.redis.del(tokenKeys);
        }

        await ctx.service.redis.del(adminSetKey);

        await redis.sadd(adminSetKey, token);
      }

      return;
    } catch (err) {
      throw new Error('Edit Admin error');
    }
  }

  async update(updateReq) {
    const { ctx } = this;
    const adminId = ctx.session[reqAdminIdKey];
    // 检查id
    const admin = await ctx.model.SystemAuthAdmin.findOne({
      where: {
        id: adminId,
        isDelete: 0,
      },
    });
    if (!admin) {
      ctx.throw(404, '账号不存在了!');
    }

    // 更新管理员信息
    const adminMap = {
      ...updateReq,
    };
    delete adminMap.currPassword;

    if (!updateReq.avatar) {
      adminMap.avatar = '/public/static/backend_avatar.png';
    } else {
      adminMap.avatar = urlUtil.toRelativeUrl(updateReq.avatar);
    }
    // delete adminMap.aaa;

    if (updateReq.password) {
      const currPass = md5(updateReq.currPassword + admin.salt);
      if (currPass !== admin.password) {
        ctx.throw(400, '当前密码不正确!');
      }
      const passwdLen = updateReq.password.length;
      if (!(passwdLen >= 6 && passwdLen <= 20)) {
        ctx.throw(400, '密码必须在6~20位');
      }
      const salt = util.randomString(5);
      adminMap.salt = salt;
      adminMap.password = md5(updateReq.password.trim() + salt);
    } else {
      delete adminMap.password;
    }

    try {
      await ctx.model.SystemAuthAdmin.update(adminMap, {
        where: {
          id: adminId,
        },
      });
    } catch (err) {
      throw new Error('更新管理员信息失败');
    }

    this.cacheAdminUserByUid(adminId);

    // 如果更改自己的密码,则删除旧缓存
    if (updateReq.password) {
      const token = ctx.request.header.token;
      await ctx.service.redis.del(backstageTokenKey + token);
      const adminSetKey = backstageTokenSet + adminId.toString();
      const ts = await ctx.service.redis.sGet(adminSetKey);
      if (ts.length > 0) {
        const tokenKeys = ts.map(t => backstageTokenKey + t);
        await ctx.service.redis.del(...tokenKeys);
      }
      await ctx.service.redis.del(adminSetKey);
      await ctx.service.redis.sSet(adminSetKey, token);
    }
  }

  async del(id) {
    const { ctx } = this;
    const adminId = ctx.session[reqAdminIdKey];

    const admin = await ctx.model.SystemAuthAdmin.findOne({
      where: {
        id,
        isDelete: 0,
      },
    });

    if (!admin) {
      throw new Error('账号已不存在!');
    }

    if (id === 1) {
      throw new Error('系统管理员不允许删除!');
    }

    if (id === adminId) {
      throw new Error('不能删除自己!');
    }

    await admin.update({
      isDelete: 1,
      deleteTime: Math.floor(Date.now() / 1000),
    });

    return null;
  }

  async disable(id) {
    const { ctx } = this;
    const adminId = ctx.session[reqAdminIdKey];

    const admin = await ctx.model.SystemAuthAdmin.findOne({
      where: {
        id,
        isDelete: 0,
      },
    });

    if (!admin) {
      throw new Error('账号已不存在！');
    }

    if (id === adminId) {
      throw new Error('不能禁用自己!');
    }

    const isDisable = admin.isDisable === 0 ? 1 : 0;

    await admin.update({
      isDisable,
      updateTime: Math.floor(Date.now() / 1000),
    });

    return null;
  }

}


module.exports = AuthAdminService;
