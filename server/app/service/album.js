const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')
const urlUtil = require('../util/urlUtil')
const path = require('path');
const { backstageRolesKey, publicPrefix } = require('../extend/config')

class AlbumService extends Service {
    async cateList(listReq) {
        const { ctx } = this;

        const { type, name } = listReq;

        const where = {
            isDelete: 0,
        };

        if (type > 0) {
            where.type = type;
        }

        if (name) {
            where.name = { [Op.like]: `%${name}%` };
        }

        const cates = await ctx.model.AlbumCate.findAll({
            where,
            order: [['id', 'DESC']],
        });

        const cateResps = cates.map(cate => {
            const cateResp = cate
            return cateResp;
        });

        const mapList = util.listToTree(
            util.structsToMaps(cateResps),
            'id',
            'pid',
            'children'
        );

        return mapList;
    }

    async cateAdd(addReq) {
        const { ctx } = this;
        try {
            const dateTime = Math.floor(Date.now() / 1000);
            const timeObject = {
                createTime: dateTime,
                updateTime: dateTime,
            }
            const cate = new ctx.model.AlbumCate();

            Object.assign(cate, addReq, timeObject);

            await cate.save();
        } catch (err) {
            throw new Error(err, 'CateAdd Create err');
        }
    }

    async cateRename(id, name) {
        const { ctx } = this;
        try {
            const cate = await ctx.model.AlbumCate.findOne({
                where: {
                    id,
                    isDelete: 0,
                },
            });

            if (!cate) {
                throw new Error('分类已不存在！');
            }

            cate.name = name;

            await cate.save();
        } catch (err) {
            throw new Error(err, 'CateRename Save err');
        }
    }

    async cateDel(id) {
        const { ctx } = this;
        try {
            const cate = await ctx.model.AlbumCate.findOne({
                where: {
                    id,
                    isDelete: 0,
                },
            });

            if (!cate) {
                throw new Error('分类已不存在！');
            }

            const albumCount = await ctx.model.Album.count({
                where: {
                    cid: id,
                    isDelete: 0,
                },
            });

            if (albumCount > 0) {
                throw new Error('当前分类正被使用中，不能删除！');
            }

            cate.isDelete = 1;
            cate.deleteTime = Math.floor(Date.now() / 1000);;

            await cate.save();
        } catch (err) {
            throw new Error(err, 'CateDel Save err');
        }
    }

    async albumList(listReq) {
        const { ctx } = this;

        const { cid, name, type, pageSize, pageNo } = listReq;

        const limit = parseInt(pageSize, 10);
        const offset = pageSize * (pageNo - 1);

        const where = {
            isDelete: 0,
        };

        if (cid > 0) {
            where.cid = cid;
        }

        if (name) {
            where.name = { [Op.like]: `%${name}%` };
        }

        if (type > 0) {
            where.type = type;
        }

        const count = await ctx.model.Album.count({ where });

        const albums = await ctx.model.Album.findAll({
            where,
            limit,
            offset,
            order: [['id', 'DESC']],
        });

        const albumResps = albums.map(album => {
            const albumResp = album
            return albumResp;
        });

        const engine = 'local';

        for (let i = 0; i < albumResps.length; i++) {
            if (engine === 'local') {
                albumResps[i].path = path.join(publicPrefix, albums[i].uri);
            } else {
                // TODO: 其他 engine
            }
            albumResps[i].uri = urlUtil.toAbsoluteUrl(albums[i].uri);
            albumResps[i].size = util.GetFmtSize(albums[i].size);
        }

        return {
            pageNo,
            pageSize,
            count: count,
            lists: albumResps,
        };
    }
}


module.exports = AlbumService
