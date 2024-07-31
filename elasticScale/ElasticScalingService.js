const os = require('os');
const osUtils = require('os-utils');
const { Worker } = require('worker_threads');

class ElasticScalingService {
    constructor() {
        this.threads = [];
    }

    async cpuUpdate(percentage) {
        this.running = true;
        const numThreads = os.cpus().length;
        const busyTime = 10n * 1000000n;
        const percentageBigInt = BigInt(percentage);
        const idleTime = busyTime * (100n - percentageBigInt) / percentageBigInt;

        for (let i = 0; i < numThreads; i++) {
            const workerData = { busyTime, idleTime };
            const worker = new Worker('./elasticScale/cpuWorker.js', { workerData });
            this.threads.push(worker);
        }
        console.log('CPU Update '+percentage+'%');
    }

    async cpuClean() {
        this.running = false;
        for (const thread of this.threads) {
            thread.terminate();
        }
        this.threads = [];
        console.log('CPU Clean');
    }

    async getCpu() {
        osUtils.cpuUsage((v) => {
            console.log('CPU Usage (%): ' + v * 100);
        });
    }
}

module.exports = ElasticScalingService;