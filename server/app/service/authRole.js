'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { backstageRolesKey } = require('../extend/config');

class AuthRoleService extends Service {
  async all() {
    const { ctx } = this;
    try {
      const roleModel = ctx.model.SystemAuthRole;
      const roles = await roleModel.findAll({
        order: [[ 'sort', 'DESC' ], [ 'id', 'DESC' ]],
      });

      const res = roles.map(role => role.toJSON());
      return res;
    } catch (err) {
      throw new Error(`AuthRoleService.all error: ${err}`);
    }
  }

  async list(page) {
    const { ctx } = this;
    const { SystemAuthRole } = ctx.model;

    try {
      const limit = parseInt(page.pageSize, 10);
      const offset = page.pageSize * (page.pageNo - 1);

      const roleModel = await SystemAuthRole.findAndCountAll({
        limit,
        offset,
        order: [[ 'sort', 'DESC' ], [ 'id', 'DESC' ]],
      });

      const [ roles, count ] = await Promise.all([
        roleModel.rows.map(role => role.toJSON()),
        roleModel.count,
      ]);

      const roleResp = await Promise.all(
        roles.map(async role => {
          const { id, name, sort, isDisable, createTime, updateTime, remark } = role;
          const member = await this.getMemberCnt(role.id);

          return {
            id,
            name,
            sort,
            isDisable,
            createTime,
            updateTime,
            remark,
            menus: [],
            member,
          };
        })
      );

      return {
        pageNo: page.pageNo,
        pageSize: page.pageSize,
        count,
        lists: roleResp,
      };
    } catch (err) {
      throw new Error('List Find err');
    }
  }
  // getMemberCnt 根据角色ID获取成员数量
  async getMemberCnt(roleId) {
    const { ctx } = this;
    const { SystemAuthAdmin } = ctx.model;

    try {
      const count = await SystemAuthAdmin.count({
        where: {
          role: {
            [Op.and]: [
              Sequelize.literal(`FIND_IN_SET('${roleId}', role) > 0`),
            ],
          },
          isDelete: 0,
        },
      });

      return count;
    } catch (err) {
      throw new Error('Get Member Count error');
    }
  }

  async detail(id) {
    const { ctx } = this;
    const { response } = ctx;

    const role = await ctx.model.SystemAuthRole.findOne({
      where: {
        id,
      },
    });

    if (!role) {
      throw response.CheckErrDBNotRecord('角色已不存在!');
    }

    const res = role.toJSON();

    const member = await this.getMemberCnt(role.id);
    const menus = await ctx.service.authAdmin.selectMenuIdsByRoleId(role.id);

    return {
      ...res,
      member,
      menus,
    };
  }

  async add(addReq) {
    const { ctx } = this;
    delete addReq.id;
    const dateTime = Math.floor(Date.now() / 1000);
    const timeObject = {
      createTime: dateTime,
      updateTime: dateTime,
    };

    const existingRole = await ctx.model.SystemAuthRole.findOne({
      where: {
        name: addReq.name.trim(),
      },
    });

    if (existingRole) {
      throw new Error('角色名称已存在!');
    }

    const role = {
      ...addReq,
      ...timeObject,
    };

    const transaction = await ctx.model.transaction();

    try {
      const createdRole = await ctx.model.SystemAuthRole.create(role, { transaction });

      await ctx.service.authAdmin.batchSaveByMenuIds(createdRole.id, addReq.menuIds, transaction);

      await transaction.commit();
    } catch (err) {
      throw new Error(err);
    }
  }

  async edit(editReq) {
    const { ctx } = this;

    const existingRole = await ctx.model.SystemAuthRole.findOne({
      where: {
        id: editReq.id,
      },
    });

    if (!existingRole) {
      throw new Error('角色已不存在!');
    }

    const role = await ctx.model.SystemAuthRole.findOne({
      where: {
        id: { [Op.ne]: editReq.id },
        name: editReq.name.trim(),
      },
    });

    if (role) {
      throw new Error('角色名称已存在!');
    }

    const roleMap = {
      ...editReq,
    };

    const transaction = await ctx.model.transaction();

    try {
      await existingRole.update(roleMap, { transaction });

      await ctx.service.authAdmin.batchDeleteByRoleId(editReq.id, transaction);
      await ctx.service.authAdmin.batchSaveByMenuIds(editReq.id, editReq.menuIds, transaction);
      await ctx.service.authAdmin.cacheRoleMenusByRoleId(editReq.id);

      await transaction.commit();
    } catch (err) {
      throw new Error(err);
    }
  }

  async del(id) {
    const { ctx } = this;

    const existingRole = await ctx.model.SystemAuthRole.findOne({
      where: {
        id,
      },
    });

    if (!existingRole) {
      throw new Error('角色已不存在!');
    }
    const admin = await ctx.model.SystemAuthAdmin.findOne({
      where: {
        role: {
          [Op.and]: [
            Sequelize.literal(`FIND_IN_SET('${id}', role) > 0`),
          ],
        },
        isDelete: 0,
      },
    });

    if (admin) {
      throw new Error('角色已被管理员使用,请先移除!');
    }

    const transaction = await ctx.model.transaction();

    try {
      await existingRole.destroy({ transaction });

      await ctx.service.authAdmin.batchDeleteByRoleId(id, transaction);

      await ctx.service.redis.hDel(backstageRolesKey, id.toString());

      await transaction.commit();
    } catch (err) {
      throw new Error(err);
    }
  }
}


module.exports = AuthRoleService;
