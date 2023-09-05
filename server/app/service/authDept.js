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
                where: { ...where },
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

    async add(addReq) {
        const { ctx } = this;
        const { SystemAuthDept } = ctx.model;

        try {
            if (addReq.pid === 0) {
                const count = await SystemAuthDept.count({
                    where: {
                        pid: 0,
                        isDelete: 0,
                    },
                });

                if (count > 0) {
                    throw new Error('顶级部门只允许有一个!');
                }
            }

            const dateTime = Math.floor(Date.now() / 1000);
            const timeObject = {
                createTime: dateTime,
                updateTime: dateTime,
            }

            await SystemAuthDept.create({ ...timeObject, ...addReq });

            return;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Add Department error');
        }
    }

    async detail(id) {
        const { ctx } = this;
        const { SystemAuthDept } = ctx.model;

        try {
            const dept = await SystemAuthDept.findOne({
                where: {
                    id,
                    isDelete: 0,
                },
                attributes: { exclude: ['deleteTime', 'isDelete'] }
            });

            if (!dept) {
                throw new Error('部门已不存在!');
            }

            return dept.toJSON();
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Get Department Detail error');
        }
    }

    async edit(editReq) {
        const { ctx } = this;
        const { SystemAuthDept } = ctx.model;

        try {
            const dept = await SystemAuthDept.findOne({
                where: {
                    id: editReq.id,
                    isDelete: 0,
                },
            });

            if (!dept) {
                throw new Error('部门不存在!');
            }

            if (dept.pid === 0 && editReq.pid > 0) {
                throw new Error('顶级部门不能修改上级!');
            }

            if (editReq.id === editReq.pid) {
                throw new Error('上级部门不能是自己!');
            }

            Object.assign(dept, editReq);

            await dept.save();

            return;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Edit Department error');
        }
    }

    async del(id) {
        const { ctx } = this;
        const { SystemAuthDept, SystemAuthAdmin } = ctx.model;

        try {
            const dept = await SystemAuthDept.findOne({
                where: {
                    id,
                    isDelete: 0,
                },
            });

            if (!dept) {
                throw new Error('部门不存在!');
            }

            if (dept.Pid === 0) {
                throw new Error('顶级部门不能删除!');
            }

            const childDeptCount = await SystemAuthDept.count({
                where: {
                    pid: id,
                    isDelete: 0,
                },
            });

            if (childDeptCount > 0) {
                throw new Error('请先删除子级部门!');
            }

            const adminCount = await SystemAuthAdmin.count({
                where: {
                    deptId: id,
                    isDelete: 0,
                },
            });

            if (adminCount > 0) {
                throw new Error('该部门已被管理员使用，请先移除!');
            }

            dept.isDelete = 1;
            await dept.save();

            return;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Delete Department error');
        }
    }

    async all() {
        const { ctx } = this;
        const { SystemAuthDept } = ctx.model;
    
        try {
          const depts = await SystemAuthDept.findAll({
            where: {
              pid: {
                [Op.gt]: 0,
              },
              isDelete: 0,
            },
            order: [['sort', 'DESC'], ['id', 'DESC']],
            attributes: { exclude: ['deleteTime', 'isDelete'] }
          });
    
          const res = depts.map(dept => dept.toJSON());
    
          return res;
        } catch (err) {
          ctx.logger.error(err);
          throw new Error('Get All Departments error');
        }
      }
}


module.exports = AuthDeptService
