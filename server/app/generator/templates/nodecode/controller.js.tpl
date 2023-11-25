'use strict'

const baseController = require('../baseController')

class {{ toPascalCase(entityName) }}Controller extends baseController {
    async list() {
        const { ctx } = this;
        const { {{ toCamelCase(entityName) }} } = ctx.service;
        try {
            const listReq = ctx.request.query;
            const data = await {{ toCamelCase(entityName) }}.list(listReq);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`{{ toPascalCase(entityName) }}Controller.list error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async add() {
        const { ctx } = this;
        const { {{ toCamelCase(entityName) }} } = ctx.service;

        try {
            const addReq = ctx.request.body;

            const data = await {{ toCamelCase(entityName) }}.add(addReq);

            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`{{ toPascalCase(entityName) }}Controller.add error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async detail() {
        const { ctx } = this;
        const { {{ toCamelCase(entityName) }} } = ctx.service;

        try {
            const id = ctx.request.query.id;

            const data = await {{ toCamelCase(entityName) }}.detail(id);

            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`{{ toPascalCase(entityName) }}Controller.detail error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async edit() {
        const { ctx } = this;
        const { {{ toCamelCase(entityName) }} } = ctx.service;

        try {
            const editReq = ctx.request.body;

            await {{ toCamelCase(entityName) }}.edit(editReq);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`{{ toPascalCase(entityName) }}Controller.edit error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async del() {
        const { ctx } = this;
        const { {{ toCamelCase(entityName) }} } = ctx.service;

        try {
            const id = ctx.request.body.id;

            await {{ toCamelCase(entityName) }}.del(id);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`{{ toPascalCase(entityName) }}Controller.del error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = SystemDeptController
