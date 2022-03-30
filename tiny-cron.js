require("dotenv").config();
const schedule = require("./schedule");
const db = require("./db");
const Cron = require("node-schedule");
const axios = require("axios");
axios.defaults.retry = 5;
axios.defaults.retryDelay = 500;
axios.defaults.timeout = 5000;
let sleep = async function (ms = 100) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
};

if (!process.argv[2]) {
    Cron.scheduleJob("* * * * *", async function () {
        console.log("sync block height " + new Date());
        await schedule.block.syncBlockHeight(1);
    });
}

if (process.argv[2] == "tx") {
    const doLoop = async () => {
        console.log("run loop");

        let ret = await schedule.block.syncBlockTxs(1);
        if (!ret) {
            await sleep(500);
        }
        await doLoop();
    };
    doLoop().then();
}

if (process.argv[2] == "tx2") {
    const doLoop2 = async () => {
        console.log("run loop2");
        try {
            const blockStat = await db.BLOCK_STATS.findOneAndUpdate(
                {
                    chainId: 1,
                    syncStatus: 1,
                },
                {
                    $set: { syncStatus: 2 },
                }
            );

            if (!blockStat) {
                await sleep(500);
                await doLoop2();
                console.log("sync tx detail completed");
                return;
            }

            await schedule.tx.syncBlockTxDetail(1, blockStat);
        } catch (error) {
            console.log(error);
        }
        await doLoop2();
    };
    doLoop2().then();
}

if (process.argv[2] == "token") {
    const doLoop3 = async () => {
        console.log("run loop3");
        let status = false;
        try {
            status = await schedule.radar.checkTx(1);
        } catch (error) {
            console.log(error);
        }
        if (!status) {
            await sleep(500);
        }
        await doLoop3();
    };
    doLoop3().then();
}
