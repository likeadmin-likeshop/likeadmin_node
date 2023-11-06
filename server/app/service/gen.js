const Service = require('egg').Service
const await = require('await-stream-ready/lib/await')
const { version, publicUrl, dbTablePrefix, genConfig, goConstants, genConstants, sqlConstants, htmlConstants } = require('../extend/config')
const util = require('../util')
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

    async importTable(tableNames) {
        const { ctx, app } = this;
        const { GenTable, GenTableColumn } = app.model;
        let dbTbs;
        try {
            dbTbs = await this.getDbTablesQueryByNames(tableNames);
        } catch (err) {
            throw new Error('ImportTable Find tables err');
        }

        if (dbTbs.length === 0) {
            throw new Error('表不存在!');
        }

        try {
            await this.ctx.model.transaction(async (transaction) => {
                for (let i = 0; i < dbTbs.length; i++) {
                    const genTable = await this.initTable(dbTbs[i]);
                    let genTableId = ''
                    try {
                        const result = await GenTable.create(genTable, { transaction });
                        genTableId = result.id
                    } catch (err) {
                        throw new Error(`ImportTable Create table err: ${err}`);
                    }

                    const columns = await this.getDbTableColumnsQueryByName(dbTbs[i].tableName);

                    for (let j = 0; j < columns.length; j++) {
                        const column = await this.initColumn(genTableId, columns[j]);
                        try {
                            await GenTableColumn.create(column, { transaction });
                        } catch (err) {
                            throw new Error(`ImportTable Create column err: ${err}`);
                        }
                    }
                }
            });
        } catch (err) {
            throw new Error('ImportTable Transaction err', err);
        }
    }

    async delTable(ids) {
        const { ctx, app } = this;
        const { GenTable, GenTableColumn } = app.model;

        try {
            await app.model.transaction(async (t) => {
                await GenTable.destroy({
                    where: {
                        id: ids,
                    },
                    transaction: t,
                });

                await GenTableColumn.destroy({
                    where: {
                        tableId: ids,
                    },
                    transaction: t,
                });
            });
        } catch (err) {
            ctx.logger.error('DelTable Transaction err', err);
            throw new Error('DelTable Transaction failed');
        }
    }

    async syncTable(id) {
        const { ctx, app } = this;
        const { GenTable, GenTableColumn } = app.model;

        try {
            // 获取旧数据
            const genTable = await GenTable.findOne({
                where: {
                    id,
                },
            });
            if (!genTable) {
                throw new Error('生成数据不存在！');
            }

            const genTableCols = await GenTableColumn.findAll({
                where: {
                    tableId: id,
                },
                order: [['sort', 'ASC']],
            });
            if (genTableCols.length <= 0) {
                throw new Error('旧数据异常！');
            }

            const prevColMap = {};
            for (let i = 0; i < genTableCols.length; i++) {
                prevColMap[genTableCols[i].columnName] = genTableCols[i];
            }

            // 获取新数据
            const columns = await this.getDbTableColumnsQueryByName(genTable.tableName);

            if (columns.length <= 0) {
                throw new Error('同步结构失败，原表结构不存在！');
            }

            // 事务处理
            await app.model.transaction(async (t) => {
                // 处理新增和更新
                for (let i = 0; i < columns.length; i++) {
                    const col = this.initColumn(id, columns[i]);
                    if (prevColMap.hasOwnProperty(columns[i].columnName)) {
                        // 更新
                        const prevCol = prevColMap[columns[i].columnName];
                        col.id = prevCol.id;
                        if (col.isList === 0) {
                            col.dictType = prevCol.dictType;
                            col.queryType = prevCol.queryType;
                        }
                        if ((prevCol.isRequired === 1 && prevCol.isPk === 0 && prevCol.isInsert === 1) || prevCol.isEdit === 1) {
                            col.htmlType = prevCol.htmlType;
                            col.isRequired = prevCol.isRequired;
                        }
                        await GenTableColumn.update(col, {
                            where: {
                                id: prevCol.id,
                            },
                            transaction: t,
                        });
                    } else {
                        // 新增
                        await col.save({ transaction: t });
                    }
                }

                // 处理删除
                const colNames = columns.map((col) => col.columnName);
                const delColIds = [];
                for (const prevCol of Object.values(prevColMap)) {
                    if (!colNames.includes(prevCol.columnName)) {
                        delColIds.push(prevCol.id);
                    }
                }
                await GenTableColumn.destroy({
                    where: {
                        id: delColIds,
                    },
                    transaction: t,
                });

            });
        } catch (err) {
            ctx.logger.error('SyncTable Transaction err', err);
            throw new Error('SyncTable Transaction failed');
        }
    }


    /**
     * 下面是通用方法
    */
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

    async getDbTablesQueryByNames(tableNames) {
        const { ctx, app } = this;
        const sequelize = app.model; // 获取 sequelize 实例

        try {
            const query = await sequelize.query(`
            SELECT table_name AS tableName, table_comment AS tableComment, create_time AS createTime, update_time AS updateTime
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
              AND table_name NOT LIKE 'qrtz_%'
              AND table_name NOT LIKE 'gen_%'
              AND table_name IN (:tableNames)
          `, {
                replacements: { tableNames },
                type: sequelize.QueryTypes.SELECT,
            });

            return query;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Failed to get database tables query by names.');
        }
    }

    async getDbTableColumnsQueryByName(tableName) {
        console.log(tableName, 'tableName...')
        const { ctx, app } = this;
        const sequelize = app.model;

        const query = await sequelize.query(`
          SELECT column_name AS columnName,
            (CASE WHEN (is_nullable = "no" AND column_key != "PRI") THEN "1" ELSE "0" END) AS isRequired,
            (CASE WHEN column_key = "PRI" THEN "1" ELSE "0" END) AS isPk,
            ordinal_position AS sort, column_comment AS columnComment,
            (CASE WHEN extra = "auto_increment" THEN "1" ELSE "0" END) AS isIncrement, column_type AS columnType
          FROM information_schema.columns
          WHERE table_schema = DATABASE() AND table_name = :tableName
          ORDER BY ordinal_position
        `, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { tableName },
        });

        return query;
    }

    async initColumn(tableId, column) {
        const columnType = await this.getDbType(column.columnType);
        const columnLen = await this.getColumnLength(column.columnType);

        const col = {
            tableId: tableId,
            columnName: column.columnName,
            columnComment: column.columnComment,
            columnType: columnType,
            columnLength: columnLen,
            javaField: column.columnName,
            javaType: goConstants.typeString,
            queryType: genConstants.QueryEq,
            sort: column.sort,
            isPk: column.isPk,
            isIncrement: column.isIncrement,
            isRequired: column.isRequired,
            createTime: Math.floor(Date.now() / 1000),
            updateTime: Math.floor(Date.now() / 1000),
        };

        // if (util.contains([...sqlConstants.ColumnTypeStr, ...sqlConstants.ColumnTypeText], columnType)) {
        //     if (columnLen >= 500 || util.contains(sqlConstants.ColumnTypeText, columnType)) {
        //         col.HtmlType = htmlConstants.HtmlTextarea;
        //     } else {
        //         col.HtmlType = htmlConstants.HtmlInput;
        //     }
        // } else if (util.contains(sqlConstants.ColumnTypeTime, columnType)) {
        //     col.JavaType = goConstants.typeDate;
        //     col.HtmlType = htmlConstants.HtmlDatetime;
        // } else if (util.contains(sqlConstants.ColumnTimeName, col.ColumnName)) {
        //     col.JavaType = goConstants.typeDate;
        //     col.HtmlType = htmlConstants.HtmlDatetime;
        // } else if (util.contains(sqlConstants.ColumnTypeNumber, columnType)) {
        //     col.HtmlType = htmlConstants.HtmlInput;
        //     if (columnType.includes(',')) {
        //         col.JavaType = goConstants.typeFloat;
        //     } else {
        //         col.JavaType = goConstants.typeInt;
        //     }
        // }

        // if (util.contains(sqlConstants.ColumnNameNotEdit, col.ColumnName)) {
        //     col.IsRequired = 0;
        // }

        // if (!util.contains(sqlConstants.ColumnNameNotAdd, col.ColumnName)) {
        //     col.IsInsert = genConstants.Require;
        // }

        // if (!util.contains(sqlConstants.ColumnNameNotEdit, col.ColumnName)) {
        //     col.IsEdit = genConstants.Require;
        //     col.IsRequired = genConstants.Require;
        // }

        // if (!util.contains(sqlConstants.ColumnNameNotList, col.ColumnName) && col.IsPk === 0) {
        //     col.IsList = genConstants.Require;
        // }

        // if (!util.contains(sqlConstants.ColumnNameNotQuery, col.ColumnName) && col.IsPk === 0) {
        //     col.IsQuery = genConstants.Require;
        // }

        // const lowerColName = col.ColumnName.toLowerCase();

        // if (lowerColName.endsWith('name') || util.contains(['title', 'mobile'], lowerColName)) {
        //     col.QueryType = genConstants.QueryLike;
        // }

        // if (lowerColName.endsWith('status') || util.contains(['is_show', 'is_disable'], lowerColName)) {
        //     col.HtmlType = htmlConstants.HtmlRadio;
        // } else if (lowerColName.endsWith('type') || lowerColName.endsWith('sex')) {
        //     col.HtmlType = htmlConstants.HtmlSelect;
        // } else if (lowerColName.endsWith('image')) {
        //     col.HtmlType = htmlConstants.HtmlImageUpload;
        // } else if (lowerColName.endsWith('file')) {
        //     col.HtmlType = htmlConstants.HtmlFileUpload;
        // } else if (lowerColName.endsWith('content')) {
        //     col.HtmlType = htmlConstants.HtmlEditor;
        // }

        return col;
    }

    async initTable(table) {
        const { ctx } = this;

        return {
            tableName: table.tableName,
            tableComment: table.tableComment,
            authorName: "",
            entityName: await this.toClassName(table.tableName),
            moduleName: await this.toModuleName(table.tableName),
            functionName: table.tableComment.replace("表", ""),
            createTime: Math.floor(Date.now() / 1000),
            updateTime: Math.floor(Date.now() / 1000),
        };
    }

    async toClassName(name) {
        const tablePrefix = dbTablePrefix;

        if (genConfig.isRemoveTablePrefix && tablePrefix !== "" && name.startsWith(tablePrefix)) {
            name = name.slice(tablePrefix.length);
        }

        return util.toCamelCase(name);
    }

    async toModuleName(name) {
        const names = name.split("_");
        return names[names.length - 1];
    }

    async getDbType(columnType) {
        console.log(columnType, 'columnType...')
        const index = columnType.indexOf('(');
        if (index < 0) {
            return columnType;
        }
        return columnType.substring(0, index);
    }

    async getColumnLength(columnType) {
        const index = columnType.indexOf('(');
        if (index < 0) {
            return 0;
        }
        const endIndex = columnType.indexOf(')', index);
        if (endIndex < 0) {
            return 0;
        }
        const lengthStr = columnType.substring(index + 1, endIndex);
        const length = parseInt(lengthStr, 10);
        if (isNaN(length)) {
            return 0;
        }
        return length;
    }
}


module.exports = GenService
