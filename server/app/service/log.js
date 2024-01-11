'use strict';

const Service = require('egg').Service;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class LogService extends Service {
  async operate(listReq) {
    const { app } = this;
    const { SystemLogOperate, SystemAuthAdmin } = app.model;

    try {
      const limit = parseInt(listReq.pageSize, 10);
      const offset = listReq.pageSize * (listReq.pageNo - 1);

      const where = {
        ...(listReq.title && { title: { [Op.like]: `%${listReq.title}%` } }),
        ...(listReq.ip && { ip: { [Op.like]: `%${listReq.ip}%` } }),
        ...(listReq.type && { type: listReq.type }),
        ...(listReq.status && { status: listReq.status }),
        ...(listReq.url && { url: listReq.url }),
        ...(listReq.startTime && listReq.endTime && {
          createTime: {
            [Op.gte]: listReq.startTime,
            [Op.lte]: listReq.endTime,
          },
        }),
        ...(listReq.username && { '$admin.username$': { [Op.like]: `%${listReq.username}%` } }),
      };
      const logModel = await SystemLogOperate.findAndCountAll({
        where,
        include: [
          { model: SystemAuthAdmin, as: 'admin' },
        ],
        limit,
        offset,
        order: [[ 'id', 'DESC' ]],
      });

      const { count, rows } = logModel;

      const data = {
        pageNo: listReq.pageNo,
        pageSize: listReq.pageSize,
        count,
        lists: rows,
      };
      return data;
    } catch (err) {
      throw new Error(`SystemLogController.operate error: ${err}`);
    }

  }
}


module.exports = LogService;
