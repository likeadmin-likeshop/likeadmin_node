const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')
const urlUtil = require('../util/urlUtil')
const path = require('path');
const { reqAdminIdKey, publicPrefix } = require('../extend/config')
const fs = require('fs');
//异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const mkdirp = require('mkdirp')
const dayjs = require('dayjs')

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
            cate.deleteTime = Math.floor(Date.now() / 1000);

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
                albumResps[i].path = albums[i].uri;
            } else {
                // TODO: 其他 engine
            }
            albumResps[i].uri = urlUtil.toAbsoluteUrl(albums[i].uri);
            albumResps[i].size = util.getFmtSize(albums[i].size);
        }

        return {
            pageNo,
            pageSize,
            count: count,
            lists: albumResps,
        };
    }

    async albumRename(id, name) {
        const { ctx } = this;
        try {
            const album = await ctx.model.Album.findOne({
                where: {
                    id,
                    isDelete: 0,
                },
            });

            if (!album) {
                throw new Error('文件丢失！');
            }

            album.name = name;

            await album.save();
        } catch (err) {
            throw new Error(err, 'AlbumRename Save err');
        }
    }

    async albumMove(ids, cid) {
        const { ctx } = this;
        try {
            const albums = await ctx.model.Album.findAll({
                where: {
                    id: ids,
                    isDelete: 0,
                },
            });

            if (albums.length === 0) {
                throw new Error('文件丢失！');
            }

            if (cid > 0) {
                const cate = await ctx.model.AlbumCate.findOne({
                    where: {
                        id: cid,
                        isDelete: 0,
                    },
                });

                if (!cate) {
                    throw new Error('类目已不存在！');
                }
            }

            await ctx.model.Album.update(
                { cid },
                {
                    where: {
                        id: ids,
                    },
                }
            );
        } catch (err) {
            throw new Error(err, 'AlbumMove UpdateColumn err');
        }

    }

    async albumAdd(addReq) {
        const { ctx } = this;
        try {
            const alb = await ctx.model.Album.create(addReq);

            return alb.id;
        } catch (err) {
            throw new Error(err, 'AlbumAdd Create err');
        }
    }

    async albumDel(ids) {
        const { ctx } = this;
        try {
            const albums = await ctx.model.Album.findAll({
                where: {
                    id: ids,
                    isDelete: 0,
                },
            });

            if (albums.length === 0) {
                throw new Error('文件丢失！');
            }

            await ctx.model.Album.update(
                {
                    isDelete: 1,
                    deleteTime: Math.floor(Date.now() / 1000)
                },
                {
                    where: {
                        id: ids,
                    },
                }
            );
        } catch (err) {
            throw new Error(err, 'AlbumDel UpdateColumn err');
        }
    }

    async uploadFile(cid, stream, type = 10) {
        const { ctx } = this;
        try {
            const { url, fileName } = await this.handleUploadFile(stream, type);
            const aid = ctx.session[reqAdminIdKey];

            const stats = fs.statSync('app' + url);
            const fileSizeInBytes = stats.size;

            const addReq = {
                aid,
                cid,
                type,
                uri: url,
                name: fileName,
                size: fileSizeInBytes,
                createTime: Math.floor(Date.now() / 1000),
                updateTime: Math.floor(Date.now() / 1000),
            };

            const albumId = await this.albumAdd(addReq);

            const res = {
                // 设置 res 的字段值...
                id: albumId,
                path: urlUtil.toAbsoluteUrl(url),
            };

            return res;

        } catch (err) {
            throw new Error(err, 'uploadImage UpdateColumn err');
        }
    }

    async handleUploadFile(stream, type = 10) {
        const pathDir = type === 10 ? '/public/uploads/image/' : '/public/uploads/video/';
        let targetDir = pathDir + dayjs().format('YYYY-MM-DD')
        const dir = path.join(this.config.baseDir, 'app', targetDir)
        await mkdirp.sync(dir)
        // 定义文件名
        const filename = Date.now() + path.extname(stream.filename).toLocaleLowerCase();
        // 目标文件
        const target = path.join('app', targetDir, filename);
        // 写入流
        const writeStream = fs.createWriteStream(target);
        try {
            //异步把文件流 写入
            await awaitWriteStream(stream.pipe(writeStream));
        } catch (err) {
            //如果出现错误，关闭管道
            await sendToWormhole(stream);
            // 自定义方法
            throw new Error(err);
        }
        // 自定义方法
        const data = {
            url: `${targetDir}/${filename}`,
            fileName: stream.filename,
        }
        return data
    }
}


module.exports = AlbumService
