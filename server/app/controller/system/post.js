'use strict';

const baseController = require('../baseController');

class SystemPostController extends baseController {
  async postList() {
    const { ctx } = this;
    try {
      const params = ctx.query;
      const data = await ctx.service.authPost.list(params);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SystemAuthPostController.postList error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async postAdd() {
    const { ctx } = this;
    const { authPost } = ctx.service;

    try {
      const addReq = ctx.request.body;

      const data = await authPost.add(addReq);

      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async postDetail() {
    const { ctx } = this;
    const { authPost } = ctx.service;

    try {
      const id = ctx.request.query.id;

      const data = await authPost.detail(id);

      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async postEdit() {
    const { ctx } = this;
    const { authPost } = ctx.service;

    try {
      const editReq = ctx.request.body;

      await authPost.edit(editReq);

      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async postDel() {
    const { ctx } = this;
    const { authPost } = ctx.service;

    try {
      const id = ctx.request.body.id;

      await authPost.del(id);

      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async postAll() {
    const { ctx } = this;
    const { authPost } = ctx.service;

    try {
      const data = await authPost.all();

      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(err);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }
}

module.exports = SystemPostController;
