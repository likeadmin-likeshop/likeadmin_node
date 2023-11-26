'use strict';

const Service = require('egg').Service;
// const { version, publicUrl } = require('../extend/config');
// const util = require('../util/urlUtil');

class WebsiteService extends Service {
  async list() {
    // const { ctx } = this;
    try {
      const engine = 'local';
      const storageList = [
        {
          name: '本地存储',
          alias: 'local',
          describe: '存储在本地服务器',
          status: 0,
        },
      ];
      const mapList = storageList;
      mapList.forEach(item => {
        if (engine === item.alias) {
          item.status = 1;
        }
      });
      return mapList;
    } catch (err) {
      throw new Error(`storageService.config error: ${err}`);
    }
  }

  async detail(alias) {
    const { ctx } = this;
    try {
      const engine = 'local';
      const cnf = await ctx.service.common.getMap('storage', alias);
      const status = engine === alias ? 1 : 0;
      return {
        name: cnf.name,
        alias,
        status,
      };
    } catch (err) {
      throw new Error(`storageService.config error: ${err}`);
    }
  }

  async edit(editReq) {
    const { ctx } = this;
    try {
      const engine = 'local';
      if (engine !== editReq.alias) {
        throw new Error(`engine:${editReq.alias} 暂时不支持`);
      }
      const json = JSON.stringify({ name: '本地存储' });
      await ctx.service.common.set('storage', editReq.alias, json);

      if (editReq.status === 1) {
        await ctx.service.common.set('storage', 'default', editReq.alias);
      } else {
        await ctx.service.common.set('storage', 'default', '');
      }
    } catch (err) {
      throw new Error('Edit Set default err');
    }
  }

  async change(alias, status) {
    const { ctx } = this;
    try {
      const engine = 'local';
      if (engine !== alias) {
        throw new Error(`engine:${alias} 暂时不支持`);
      }
      if (engine === alias && status === 0) {
        await ctx.service.common.set('storage', 'default', '');
      } else {
        await ctx.service.common.set('storage', 'default', alias);
      }
    } catch (err) {
      throw new Error('Change Set err');
    }
  }
}


module.exports = WebsiteService;
