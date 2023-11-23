const Service = require('egg').Service
const await = require('await-stream-ready/lib/await')
const { version, publicUrl, dbTablePrefix, genConfig, goConstants, genConstants, sqlConstants, htmlConstants } = require('../extend/config')
const util = require('../util')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const templateUtil = require('../util/templateUtil');
const fs = require('fs');
const archiver = require('archiver');

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

    //PreviewCode 预览代码
    async previewCode(id) {
        const { ctx, app } = this;
        const { GenTable } = app.model;

        const genTable = await GenTable.findOne({ where: { id } });

        if (!genTable) {
            throw new Error('记录丢失！');
        }

        const tplCodeMap = await this.renderCodeByTable(genTable);

        const res = {};
        for (const tplPath in tplCodeMap) {
            res[tplPath.replace('.tpl', '')] = tplCodeMap[tplPath];
        }

        return res;
    }

    //DownloadCode 下载代码
    async downloadCode(zipPath, tableNames) {
        try {
            for (const tableName of tableNames) {
                await this.genZipCode(zipPath, tableName);
            }
            return zipPath;
        } catch (err) {
            throw new Error(`DownloadCode error: ${err.message}`);
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

        if (util.contains([...sqlConstants.columnTypeStr, ...sqlConstants.columnTypeText], columnType)) {
            if (columnLen >= 500 || util.contains(sqlConstants.columnTypeText, columnType)) {
                col.htmlType = htmlConstants.htmlTextarea;
            } else {
                col.htmlType = htmlConstants.htmlInput;
            }
        } else if (util.contains(sqlConstants.columnTypeTime, columnType)) {
            col.javaType = goConstants.typeDate;
            col.htmlType = htmlConstants.htmlDatetime;
        } else if (util.contains(sqlConstants.columnTimeName, col.columnName)) {
            col.javaType = goConstants.typeDate;
            col.htmlType = htmlConstants.htmlDatetime;
        } else if (util.contains(sqlConstants.columnTypeNumber, columnType)) {
            col.htmlType = htmlConstants.htmlInput;
            if (columnType.includes(',')) {
                col.javaType = goConstants.typeFloat;
            } else {
                col.javaType = goConstants.typeInt;
            }
        }

        if (util.contains(sqlConstants.columnNameNotEdit, col.columnName)) {
            col.isRequired = 0;
        }

        if (!util.contains(sqlConstants.columnNameNotAdd, col.columnName)) {
            col.isInsert = genConstants.require;
        }

        if (!util.contains(sqlConstants.columnNameNotEdit, col.columnName)) {
            col.isEdit = genConstants.require;
            col.isRequired = genConstants.require;
        }

        if (!util.contains(sqlConstants.columnNameNotList, col.columnName) && col.isPk === 0) {
            col.isList = genConstants.require;
        }

        if (!util.contains(sqlConstants.columnNameNotQuery, col.columnName) && col.isPk === 0) {
            col.isQuery = genConstants.require;
        }

        const lowerColName = col.columnName.toLowerCase();

        if (lowerColName.endsWith('name') || util.contains(['title', 'mobile'], lowerColName)) {
            col.queryType = genConstants.queryLike;
        }

        if (lowerColName.endsWith('status') || util.contains(['is_show', 'is_disable'], lowerColName)) {
            col.htmlType = htmlConstants.htmlRadio;
        } else if (lowerColName.endsWith('type') || lowerColName.endsWith('sex')) {
            col.htmlType = htmlConstants.htmlSelect;
        } else if (lowerColName.endsWith('image')) {
            col.htmlType = htmlConstants.htmlImageUpload;
        } else if (lowerColName.endsWith('file')) {
            col.htmlType = htmlConstants.htmlFileUpload;
        } else if (lowerColName.endsWith('content')) {
            col.htmlType = htmlConstants.htmlEditor;
        }

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

    async getTablePriCol(columns) {
        for (const col of columns) {
            if (col.isPk === 1) {
                return col;
            }
        }
    }

    //getSubTableInfo 根据主表获取子表主键和列信息
    async getSubTableInfo(genTable) {
        const { ctx, app } = this;
        const { GenTable, GenTableColumn } = app.model;
        if (!genTable.tableName || !genTable.subTableFk) {
            return;
        }

        try {
            const table = await GenTable.findOne({
                where: {
                    tableName: genTable.tableName,
                },
            });

            if (!table) {
                throw new Error('子表记录丢失！');
            }

            const cols = await this.getDbTableColumnsQueryByName(genTable.tableName);

            const pkCol = await this.initColumn(table.id, await this.getTablePriCol(cols));

            return { pkCol, cols };
        } catch (err) {
            throw new Error('getSubTableInfo error: ' + err);
        }
    }

    //renderCodeByTable 根据主表和模板文件渲染模板代码
    async renderCodeByTable(genTable) {
        const { ctx, app } = this;
        const { GenTableColumn } = app.model;

        const columns = await GenTableColumn.findAll({ where: { tableId: genTable.id }, order: [['sort', 'ASC']] });

        const data = await this.getSubTableInfo(genTable);

        const pkCol = data?.pkCol || {};
        const cols = data?.cols || [];

        const vars = templateUtil.prepareVars(genTable, columns, pkCol, cols);

        const res = {};
        for (const tplPath of templateUtil.getTemplatePaths(genTable.genTpl)) {
            res[tplPath] = await templateUtil.render(tplPath, vars);
        }

        return res;
    }

    //GetFilePaths 获取生成文件相对路径
    async getFilePaths(tplCodeMap, moduleName) {
        try {
            const fmtMap = {
                'gocode/model.go.tpl': 'gocode/%s/model.go',
                'gocode/controller.go.tpl': 'gocode/%s/controller.go',
                'gocode/service.go.tpl': 'gocode/%s/service.go',
                'gocode/route.go.tpl': 'gocode/%s/route.go',
                'vue/api.ts.tpl': 'vue/%s/api.ts',
                'vue/edit.vue.tpl': 'vue/%s/edit.vue',
                'vue/index.vue.tpl': 'vue/%s/index.vue',
                'vue/index-tree.vue.tpl': 'vue/%s/index-tree.vue',
            };

            const filePath = {};
            for (const tplPath in tplCodeMap) {
                console.log(tplPath, 'tplPath....')
                const file = fmtMap[tplPath].replace('%s', moduleName);
                filePath[file] = tplCodeMap[tplPath];
            }
            return filePath;
        } catch (err) {
            throw new Error(`getFilePaths error: ${err.message}`);
        }
    };

    async addFileToZip(zipPath, file) {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(output);

        const header = { name: file.Name, method: 'DEFLATE' };
        archive.append(file.Body, header);

        await util.promisify(archive.finalize)();

        return zipPath;
    };

    // 生成代码压缩包
    async genZip(zipPath, tplCodeMap, moduleName) {
        try {
            const filePaths = await this.getFilePaths(tplCodeMap, moduleName);
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.pipe(output);

            for (const file in filePaths) {
                const tplCode = filePaths[file];
                archive.append(tplCode, { name: file });
            }

            await archive.finalize();
        } catch (err) {
            throw new Error(`genZip error: ${err.message}`);
        }
    }

    //genZipCode 生成代码 (压缩包下载)
    async genZipCode(zipPath, tableName) {
        const { ctx, app } = this;
        const { GenTable } = app.model;

        try {
            const genTable = await GenTable.findOne({
                where: { tableName },
                order: [['id', 'DESC']],
                limit: 1,
            });

            if (!genTable) {
                throw new Error('记录丢失！');
            }

            //获取模板内容
            const tplCodeMap = await this.renderCodeByTable(genTable);

            //压缩文件
            await this.genZip(zipPath, tplCodeMap, genTable.moduleName);
        } catch (err) {
            throw new Error(`genZipCode error: ${err.message}`);
        }
    }

}


module.exports = GenService
