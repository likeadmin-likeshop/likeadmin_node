const os = require('os');
const util = require('./index');
var ip = require("ip");
const process = require('process');
const runtime = require('process').version;

// 导出公共方法
module.exports = {
    async getCpuInfo() {
        const cpus = os.cpus();
        let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;
        // 遍历 CPU
        for (const cpu in cpus) {
            const times = cpus[cpu].times;
            user += times.user;
            nice += times.nice;
            sys += times.sys;
            idle += times.idle;
            irq += times.irq;
        }
        total += user + nice + sys + idle + irq;

        return {
            cpu_num: cpus.length,
            total: util.round(total, 2),
            sys: util.round(sys / total, 2),
            used: util.round(user / total, 2),
            // wait: util.round(wait/total, 2),
            free: util.round(idle / total, 2)
        };
    },

    async getMemInfo() {
        const number = Math.pow(1024, 3);
        const total = await os.totalmem();
        const used = process.memoryUsage().rss;
        const free = total - used;
        const usage = (used / total) * 100;

        return {
            total: util.round(total / number, 2),
            used: util.round(used / number, 2),
            free: util.round(free / number, 2),
            usage: util.round(usage, 2),
        };
    },

    async getSysInfo() {
        const computerName = os.hostname();
        const computerIp = ip.address();
        const userDir = os.homedir();
        const osName = os.type();
        const osArch = os.arch();

        return {
            computerName,
            computerIp,
            userDir,
            osName,
            osArch,
        };
    },

    async getDiskInfo() {
        const data = [];

        return data;
    },

    //getNodeInfo 获取Node环境及服务信息
    async getNodeInfo() {
        const number = Math.pow(1024, 2);
        // console.log(process, 'os.getpid()....')
        // const curProc = await process.getProcess(process.pid);
        // const memInfo = await process.getMemoryInfo(curProc.pid);
        // const startTime = curProc.createTime;

        return {
            name: 'Node',
            version: runtime,
            home: process.argv[0],
            // inputArgs: process.argv.slice(1).join(', '),
            // total: util.round(memInfo.vms / number, 2),
            // max: util.round(memInfo.vms / number, 2),
            // free: util.round((memInfo.vms - memInfo.rss) / number, 2),
            // usage: util.round(memInfo.rss / number, 2),
            // runTime: util.getFmtTime(Date.now() - startTime),
            // startTime: new Date(startTime).toISOString(),
        };
    },
};