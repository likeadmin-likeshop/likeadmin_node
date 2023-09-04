const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')

class AuthDeptService extends Service {
    async list(listReq) {
        const { ctx } = this;
        try {
            const where = {
                isDelete: 0,
            }
            for (const paramKey in listReq) {
                if (paramKey === 'isStop' && listReq[paramKey]) {
                    where[paramKey] = listReq[paramKey]
                } else {
                    where[paramKey] = { [Op.like]: `%${listReq[paramKey]}%` } // 模糊查找
                }
            }
            const deptModel = ctx.model.SystemAuthDept;
            let deptQuery = deptModel.findAll({
                where: {...where},
                order: [['sort', 'DESC'], ['id', 'DESC']],
                attributes: { exclude: ['deleteTime', 'isDelete'] }  // 排除该字段显示
            });

            const depts = await deptQuery;
            const deptResps = depts.map(dept => dept.toJSON());
            const mapList = util.listToTree(
                deptResps,
                'id',
                'pid',
                'children'
            );

            return mapList;
        } catch (err) {
            ctx.logger.error(`AuthDeptService.list error: ${err}`);
            throw err;
        }
    }
}


module.exports = AuthDeptService
