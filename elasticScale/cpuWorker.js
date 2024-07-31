const { parentPort, workerData } = require('worker_threads');

const { busyTime, idleTime } = workerData;

async function stressCPU() {
    while (true) {
        const startTime = process.hrtime.bigint();
        // Busy loop
        while (process.hrtime.bigint() - startTime < busyTime) {}
        // Sleep
        await new Promise(resolve => setTimeout(resolve, Number(idleTime / 1000000n)));
    }
}

stressCPU();
