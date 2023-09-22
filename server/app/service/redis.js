const Service = require('egg').Service
const time = 60 * 60 * 24 * 30 //默认缓存失效时间 30天
const { redisPrefix } = require('../extend/config')

class RedisService extends Service {
    /**
     * 设置对应缓存
     * @param {String} key 名称
     * @param {*} value 数据
     * @param {*} seconds 缓存时间
     */
    async set(key, value, seconds) {
        const { redis } = this.app;
        // 判断 Redis：关闭Redis，返回空
        if (!redis) {
            return;
        }
        value = JSON.stringify(value);
        if (!seconds) {
            await redis.set(key, value, 'EX', time);
        } else {
            // 设置有效时间
            await redis.set(key, value, 'EX', seconds);
        }
    }
    /**
     * 获取对应缓存
     * @param {String} key 名称
     */
    async get(key) {
        const { redis } = this.app;
        // 判断 Redis：关闭Redis，返回空
        if (!redis) {
            return;
        }
        let data = await redis.get(key);
        if (!data) return false;
        data = JSON.parse(data);
        return data;
    }
    /**
     * 删除key
     * @param {String} key 需要删除的key
     */
    async del(key) {
        const { redis } = this.app;
        const data = await redis.del(key);
        return data;
    }
    // 清空 redis
    async flushall() {
        const { redis } = this.app;
        await redis.flushall();
        return;
    }
    async sSet(key, values) {
        const { redis } = this.app;
        const prefix = redisPrefix;
        const result = await redis.sadd(prefix + key, values[0]);
        return result;
    }
    async sGet(key) {
        const { redis } = this.app;
        const prefix = redisPrefix;
        const result = await redis.smembers(prefix + key);
        return result;
    }

    //HSet 向hash表中放入数据,如果不存在将创建
    async hGet(key, field) {
        const { redis } = this.app;
        const prefix = redisPrefix;
        const result = await redis.hget(prefix + key, field);
        if (!result) {
            return false;
        }
        return result;
    }

    //HSet 向hash表中放入数据,如果不存在将创建
    async hSet(key, field, value, timeSec) {
        const { redis } = this.app;
        const prefix = redisPrefix;
        const result = await redis.hset(prefix + key, field, value);
        if (timeSec > 0) {
            if (!(await redis.expire(redisPrefix + key, timeSec))) {
                return false;
            }
        }
        return result;
    }

    //hDel 向hash表中删除数据
    async hDel(key, field) {
        const { redis } = this.app;
        const prefix = redisPrefix;
        const result = await redis.hdel(prefix + key, field);
        return result;
    }

    //HExists 向hash表中判断多项key是否存在
    async hExists(key, field) {
        const { redis } = this.app;
        const prefix = redisPrefix;
        const result = await redis.hexists(prefix + key, field);
        return result;
    }

    //Exists 判断多项key是否存在
    async exists(key) {
        const { redis } = this.app;
        const result = await redis.exists(key);
        return result;
    }

    //TTL 根据key获取过期时间
    async ttl(key) {
        const { redis } = this.app;
        const result = await redis.ttl(key)
        return result
    }

    //Expire 指定缓存失效时间
    async expire(key, timeSec) {
        const { redis } = this.app;
        const result = await redis.expire(key, timeSec);
        return result;
    }

    async info(sections) {
        const { redis } = this.app;
        const infoStr = sections ? await redis.info(sections) : await redis.info();
        const res = {};

        const lines = infoStr.split('\r\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === '' || lines[i].startsWith('# ')) {
                continue;
            }
            const [k, v] = lines[i].split(':');
            res[k] = v;
        };

        return res;
    }

    async dbSize() {
        const { redis } = this.app;
        const res = await redis.dbsize();
        return res;
    }
}

module.exports = RedisService
