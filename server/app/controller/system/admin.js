'use strict';

const baseController = require('../baseController');
const {
  reqAdminIdKey,
} = require('../../extend/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const urlUtil = require('../../util/urlUtil');

class SystemAdminController extends baseController {
  async adminList() {
    const { ctx } = this;
    try {
      const params = ctx.query;
      const data = await ctx.service.authAdmin.adminList(params);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SystemController error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async self() {
    const { ctx } = this;
    const SystemAuthAdmin = ctx.model.SystemAuthAdmin;
    const SystemAuthMenu = ctx.model.SystemAuthMenu;
    const authAdminService = ctx.service.authAdmin;
    const adminId = ctx.session[reqAdminIdKey];

    try {
      const sysAdmin = await SystemAuthAdmin.findOne({
        where: {
          id: adminId,
          isDelete: 0,
        },
        attributes: [ 'id', 'nickname', 'nickname', 'avatar', 'role', 'deptId', 'isMultipoint', 'isDisable', 'lastLoginIp', 'lastLoginTime', 'createTime', 'updateTime' ],
      });

      if (!sysAdmin) {
        return null;
      }

      let auths = [];
      if (adminId > 1) {
        const roleId = parseInt(sysAdmin.role, 10);
        const menuIds = await authAdminService.selectMenuIdsByRoleId(roleId);

        if (menuIds.length > 0) {
          const menus = await SystemAuthMenu.findAll({
            where: {
              id: {
                [Op.in]: menuIds,
              },
              isDisable: 0,
              menuType: [ 'C', 'A' ],
            },
            order: [[ 'menuSort', 'ASC' ], [ 'id', 'ASC' ]],
          });

          if (menus.length > 0) {
            auths = menus.map(menu => menu.perms.trim());
          }
        }
      } else {
        auths = [ '*' ];
      }

      const admin = {
        user: {
          ...sysAdmin.toJSON(),
          dept: sysAdmin.deptId.toString(),
          avatar: urlUtil.toAbsoluteUrl(sysAdmin.avatar),
        },
        permissions: auths,
      };

      this.result({
        data: admin,
      });
    } catch (err) {
      ctx.logger.error(err);
      return null;
    }
  }

  async detail() {
    const { ctx } = this;
    const { authAdmin } = ctx.service;

    try {
      const id = ctx.query.id;

      const data = await authAdmin.detail(id);

      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async add() {
    const { ctx } = this;
    const { authAdmin } = ctx.service;

    try {
      const addReq = ctx.request.body;

      await authAdmin.add(addReq);

      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async edit() {
    const { ctx } = this;
    const { authAdmin } = ctx.service;

    try {
      const editReq = ctx.request.body;

      await authAdmin.edit(editReq);

      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async update() {
    const { ctx } = this;
    const { authAdmin } = ctx.service;

    try {
      const editReq = ctx.request.body;

      await authAdmin.update(editReq);

      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async del() {
    const { ctx } = this;
    const { authAdmin } = ctx.service;

    try {
      const id = ctx.request.body.id;

      await authAdmin.del(id);

      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async disable() {
    const { ctx } = this;
    const { authAdmin } = ctx.service;

    try {
      const id = ctx.request.body.id;

      await authAdmin.disable(id);

      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }
}

module.exports = SystemAdminController;
