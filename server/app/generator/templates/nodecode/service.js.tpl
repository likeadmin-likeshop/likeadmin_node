const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class {{ toPascalCase(entityName) }}Service extends Service {
	
	//list
    async list(listReq) {
        const { ctx, app } = this;
        const { {{ toPascalCase(entityName) }} } = app.model;

        try {
            const limit = parseInt(listReq.pageSize, 10);
            const offset = listReq.pageSize * (listReq.pageNo - 1);

            const where = {};
            const {{ toPascalCase(entityName) }}Model = await {{ toPascalCase(entityName) }}.findAndCountAll({
                where,
                limit,
                offset,
                order: [['id', 'DESC']],
            });

            const { count, rows } = {{ toPascalCase(entityName) }}Model;

            const data = {
                pageNo: listReq.pageNo,
                pageSize: listReq.pageSize,
                count,
                lists: rows,
            };
            return data;
        } catch (err) {
            throw new Error(`{{ toPascalCase(entityName) }}Service.list error: ${err}`);
        }
    }

	// detail
    async detail(id) {
        const { ctx, app } = this;
        const { {{ toPascalCase(entityName) }} } = app.model;

		try {
			const res = await {{ toPascalCase(entityName) }}.findOne({
				where: {
					id,
				},
			});

			return res.toJSON();
		} catch (err) {
            throw new Error(`{{ toPascalCase(entityName) }}Service.detail error: ${err}`);
        }
    }

	// add
    async add(addReq) {
        const { ctx, app } = this;
        const { {{ toPascalCase(entityName) }} } = ctx.model;

        try {
            const dateTime = Math.floor(Date.now() / 1000);
            const timeObject = {
                createTime: dateTime,
                updateTime: dateTime,
            }

            await {{ toPascalCase(entityName) }}.create({ ...timeObject, ...addReq });

            return;
        } catch (err) {
            throw new Error(`{{ toPascalCase(entityName) }}Service.add error: ${err}`);
        }
    }

	// edit
    async edit(editReq) {
        const { ctx, app } = this;
        const { {{ toPascalCase(entityName) }} } = ctx.model;

        try {
            const res = await {{ toPascalCase(entityName) }}.findOne({
                where: {
                    id: editReq.id,
                    isDelete: 0,
                },
            });

            if (!res) {
                throw new Error('数据不存在!');
            }

            Object.assign(res, editReq);

            await res.save();

            return;
        } catch (err) {
            throw new Error(`{{ toPascalCase(entityName) }}Service.edit error: ${err}`);
        }
    }

    async del(id) {
        const { ctx, app } = this;
        const { {{ toPascalCase(entityName) }} } = ctx.model;

        try {
            const res = await {{ toPascalCase(entityName) }}.findOne({
                where: {
                    id,
                    isDelete: 0,
                },
            });

            if (!res) {
                throw new Error('数据不存在!');
            }

            res.isDelete = 1;
            await res.save();

            return;
        } catch (err) {
            throw new Error(`{{ toPascalCase(entityName) }}Service.del error: ${err}`);
        }
    }

}


module.exports = {{ toPascalCase(entityName) }}Service
