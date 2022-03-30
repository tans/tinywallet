require("dotenv").config();
const db = require("../db");
const axios = require("axios");
const moment = require("moment");

const syncBlockHeight = async (chainId) => {
    if (!chainId) {
        throw new Error("lockof chainId");
    }
    const startDate = moment().add(-5, "minutes").toISOString();
    const url = `https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/latest/?quote-currency=USD&format=JSON&key=${process.env.COVALENT_KEY}`;
    console.log(url);
    const { data: data } = await axios.get(url);

    for (item of data.data.items) {
        console.log(item);
        await db.BLOCK_STATS.findOneAndUpdate(
            {
                height: item.height,
                chainId: chainId,
            },
            {
                $set: { signedAt: item.signed_at },
                $setOnInsert: { syncStatus: 0 },
            },
            { upsert: true }
        );
    }

    console.log("complete");
};

const syncBlockTxs = async (chainId) => {
    const infuraUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`;
    const blockStat = await db.BLOCK_STATS.findOneAndUpdate(
        { chainId: chainId, syncStatus: 0 },
        { $set: { syncStatus: 1 } }
    );

    if (!blockStat) {
        console.log("sync tx list completed");
        return false;
    }
    try {
        const { data } = await axios({
            method: "POST",
            url: infuraUrl,
            data: {
                jsonrpc: "2.0",
                method: "eth_getBlockByNumber",
                params: ["0x" + blockStat.height.toString(16), true],
                id: 2,
            },
        });
        let stat = await db.BLOCK_STATS.findOneAndUpdate(blockStat._id, {
            $set: { result: data.result },
        });
        return stat;
    } catch (error) {
        await db.BLOCK_STATS.findOneAndUpdate(blockStat._id, {
            $set: { syncStatus: 0 },
        });
        console.log(error);
        return false;
    }
};

module.exports = {
    syncBlockHeight: syncBlockHeight,
    syncBlockTxs: syncBlockTxs,
};
if (require.main == module) {
    syncBlockTxs(1).then();
}
