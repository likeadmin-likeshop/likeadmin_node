const Service = require('egg').Service
const await = require('await-stream-ready/lib/await')
const { version, publicUrl } = require('../extend/config')
const util = require('../util/urlUtil')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class GenService extends Service {
    async list(listReq) {
        const { ctx, app } = this;
        const { GenTable } = app.model;

        try {
            const { pageSize, pageNo, tableName, tableComment, startTime, endTime } = listReq;

            const limit = parseInt(pageSize, 10);
            const offset = pageSize * (pageNo - 1);

            const whereClause = {};
            if (tableName) {
                whereClause.tableName = { [Op.like]: `%${tableName}%` };
            }
            if (tableComment) {
                whereClause.tableComment = { [Op.like]: `%${tableComment}%` };
            }
            if (startTime) {
                whereClause.createTime = { [Op.gte]: startTime };
            }
            if (endTime) {
                whereClause.createTime = { [Op.lte]: endTime };
            }

            const { count, rows: genResp } = await GenTable.findAndCountAll({
                where: whereClause,
                limit,
                offset,
            });

            const data = {
                pageNo,
                pageSize,
                count,
                lists: genResp,
            };
            return data;
        } catch (error) {
            throw new Error(`GenService.list error: ${error}`);
        }
    }

    async dbTables(listReq) {
        const { ctx } = this;
        const { pageSize, pageNo, tableName, tableComment } = listReq;
        const limit = parseInt(pageSize, 10);
        const offset = pageSize * (pageNo - 1);
        const result = await this.getDbTablesQuery(tableName, tableComment, limit, offset);

        const count = result.total;
        const tbResp = result.data;

        return {
            pageNo,
            pageSize,
            count: count,
            lists: tbResp,
        };
    }

    async getDbTablesQuery(tableName, tableComment, limit, offset) {
        const { ctx, app } = this;
        const sequelize = app.model; // 获取 Sequelize 实例

        let whereStr = "";
        if (tableName) {
            whereStr += `AND lower(table_name) like lower("%${tableName}%")`;
        }
        if (tableComment) {
            whereStr += `AND lower(table_comment) like lower("%${tableComment}%")`;
        }

        try {
            const countResult = await sequelize.query(`
                SELECT COUNT(*) AS total
                FROM information_schema.tables
                WHERE table_schema = DATABASE()
                AND table_name NOT LIKE 'qrtz_%'
                AND table_name NOT LIKE 'gen_%'
                AND table_name NOT IN (SELECT table_name FROM la_gen_table)
                ${whereStr}
            `, {
                type: sequelize.QueryTypes.SELECT,
            });
            const totalCount = countResult[0].total;

            const queryResult = await sequelize.query(`
                SELECT table_name AS tableName, table_comment AS tableComment, DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') AS createTime, update_time AS updateTime
                FROM information_schema.tables
                WHERE table_schema = DATABASE()
                AND table_name NOT LIKE 'qrtz_%'
                AND table_name NOT LIKE 'gen_%'
                AND table_name NOT IN (SELECT table_name FROM la_gen_table)
                ${whereStr}
                LIMIT ${limit} OFFSET ${offset}`, {
                type: sequelize.QueryTypes.SELECT,
            });

            return {
                total: totalCount,
                data: queryResult,
            };
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Failed to get database tables query.');
        }
    }
}


module.exports = GenService
