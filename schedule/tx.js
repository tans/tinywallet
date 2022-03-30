require("dotenv").config();
const db = require("../db");
const axios = require("axios");
const moment = require("moment");
const asyncUtil = require("async");
let sleep = async function (ms = 100) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
};
const _ = require("lodash");

const syncBlockTxDetail = (chainId, blockStat) => {
    return new Promise((resolve, reject) => {
        let interator = async function (transation) {
            if (transation.input == "0x") {
                console.log("regular transation");
                return;
            }
            const url = `https://api.covalenthq.com/v1/1/transaction_v2/${transation.hash}/?quote-currency=USD&format=JSON&no-logs=false&key=${process.env.COVALENT_KEY}`;
            console.log(url);
            try {
                const { data } = await axios.get(url);
                let tx = data.data;
                tx.checkStatus = 0;
                tx.chainId = chainId;
                console.log(tx);
                await db.TXS.insert(tx);
            } catch (error) {
                console.log(error);
            }
            await sleep(900);
        };
        asyncUtil.mapLimit(
            blockStat.result.transactions,
            16,
            interator,
            function (err, result) {
                db.BLOCK_STATS.findOneAndUpdate(blockStat._id, {
                    $set: { syncStatus: 3 },
                }).then();
                resolve(result);
                console.log("sync tx ok");
            }
        );
    });
};

module.exports = { syncBlockTxDetail };

if (require.main == module) {
    syncBlockTxDetail(1).then();
}
