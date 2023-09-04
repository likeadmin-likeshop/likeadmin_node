const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')

class SystemAuthRoleService extends Service {
    async all() {
        const { ctx } = this;
        try {
            const roleModel = ctx.model.SystemAuthRole;
            const roles = await roleModel.findAll({
                order: [['sort', 'DESC'], ['id', 'DESC']],
              });
        
              const res = roles.map(role => role.toJSON());
              return res;
        } catch (err) {
            ctx.logger.error(`SystemAuthRoleService.all error: ${err}`);
            throw err;
        }
    }
}


module.exports = SystemAuthRoleService
