const Service = require('egg').Service
const time = 60 * 60 * 24 * 30 //默认缓存失效时间 30天
const { RedisPrefix } = require('../extend/config')

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
        if (!data) return;
        data = JSON.parse(data);
        return data;
    }
    /**
     * 删除一个(或多个)keys
     * @param {Array} keys 需要删除的keys
     */
    async del(keys) {
        const { redis } = this.app;
        const data = await redis.del(...keys);
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
        const prefix = RedisPrefix;
        const result = await redis.sadd(prefix + key, values[0]);
        return result;
    }
    async sGet(key) {
        const { redis } = this.app;
        const prefix = RedisPrefix;
        const result = await redis.smembers(prefix + key);
        return result;
    }

    //HSet 向hash表中放入数据,如果不存在将创建
    async hGet(key, field) {
        const { redis } = this.app;
        const prefix = RedisPrefix;
        const result = await redis.hget(prefix + key, field);
        if(!result) {
            return false;
        }
        return result;
    }

    //HSet 向hash表中放入数据,如果不存在将创建
    async hSet(key, field, value, timeSec) {
        const { redis } = this.app;
        const prefix = RedisPrefix;
        const result = await redis.hset(prefix + key, field, value);
        if (timeSec > 0) {
            if (!(await redis.expire(RedisPrefix + key, timeSec))) {
                return false;
            }
        }
        return result;
    }
}


module.exports = RedisService
