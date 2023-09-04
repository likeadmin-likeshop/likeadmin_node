const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')

class AuthPostService extends Service {
    async list(listReq) {
        const { ctx } = this;
        try {
            const postModel = ctx.model.SystemAuthPost;
            const limit = parseInt(listReq.pageSize, 10);
            const offset = listReq.pageSize * (listReq.pageNo - 1);

            const { name, isStop, code  } = listReq;
            const params = { name, isStop, code };
            const where = {
                isDelete: 0,
            }
            for (const paramKey in params) {
                if (paramKey === 'isStop' && params[paramKey]) {
                    where[paramKey] = params[paramKey]
                } else {
                    where[paramKey] = { [Op.like]: `%${params[paramKey]}%` } // 模糊查找
                }
            }

            let postQuery = postModel.findAll({
                where: {...where},
                order: [['id', 'DESC']],
                limit,
                offset,
            });

            const posts = await postQuery;
            const postResps = posts.map(post => post.toJSON());

            const count = await postModel.count({
                where: {...where},
            });

            return {
                pageNo: listReq.pageNo,
                pageSize: listReq.pageSize,
                count,
                lists: postResps,
            };
        } catch (err) {
            ctx.logger.error(`AuthPostService.list error: ${err}`);
            throw err;
        }
    }
}


module.exports = AuthPostService
