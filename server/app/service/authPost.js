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

            const { name, isStop, code } = listReq;
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
                where: { ...where },
                order: [['id', 'DESC']],
                limit,
                offset,
            });

            const posts = await postQuery;
            const postResps = posts.map(post => post.toJSON());

            const count = await postModel.count({
                where: { ...where },
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

    async detail(id) {
        const { ctx } = this;
        const { SystemAuthPost } = ctx.model;

        try {
            const post = await SystemAuthPost.findOne({
                where: {
                    id,
                    isDelete: 0,
                },
            });

            if (!post) {
                throw new Error('岗位不存在!');
            }

            const res = post.toJSON();

            return res;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Get Post Detail error');
        }
    }

    async add(addReq) {
        const { ctx } = this;
        const { SystemAuthPost } = ctx.model;

        const dateTime = Math.floor(Date.now() / 1000);
        const timeObject = {
            createTime: dateTime,
            updateTime: dateTime,
        }
        delete addReq.id;
        Object.assign(addReq, timeObject);

        try {
            const existingPost = await SystemAuthPost.findOne({
                where: {
                    [Op.or]: [
                        { code: addReq.code },
                        { name: addReq.name },
                    ],
                    isDelete: 0,
                },
            });

            if (existingPost) {
                throw new Error('该岗位已存在!');
            }

            const post = SystemAuthPost.build(addReq);

            await post.save();

            return;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Add Post error');
        }
    }

    async edit(editReq) {
        const { ctx } = this;
        const { SystemAuthPost } = ctx.model;

        try {
            const post = await SystemAuthPost.findOne({
                where: {
                    id: editReq.id,
                    isDelete: 0,
                },
            });

            if (!post) {
                throw new Error('岗位不存在!');
            }

            const existingPost = await SystemAuthPost.findOne({
                where: {
                    [Op.or]: [
                        { code: editReq.code },
                        { name: editReq.name },
                    ],
                    id: {
                        [Op.ne]: editReq.id,
                    },
                    isDelete: 0,
                },
            });

            if (existingPost) {
                throw new Error('该岗位已存在!');
            }

            Object.assign(post, editReq);

            await post.save();

            return;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Edit Post error');
        }
    }

    async del(id) {
        const { ctx } = this;
        const { SystemAuthPost, SystemAuthAdmin } = ctx.model;

        try {
            const post = await SystemAuthPost.findOne({
                where: {
                    id,
                    isDelete: 0,
                },
            });

            if (!post) {
                throw new Error('岗位不存在!');
            }

            const admin = await SystemAuthAdmin.findOne({
                where: {
                    postId: id,
                    isDelete: 0,
                },
            });

            if (admin) {
                throw new Error('该岗位已被管理员使用，请先移除!');
            }

            post.isDelete = 1;

            await post.save();

            return;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Delete Post error');
        }
    }

    async all() {
        const { ctx } = this;
        const { SystemAuthPost } = ctx.model;
    
        try {
          const posts = await SystemAuthPost.findAll({
            where: {
              isDelete: 0,
            },
            order: [
              ['sort', 'DESC'],
              ['id', 'DESC'],
            ],
          });
    
          const res = posts.map(post => post.toJSON());
    
          return res;
        } catch (err) {
          ctx.logger.error(err);
          throw new Error('Get All Posts error');
        }
      }
}


module.exports = AuthPostService
