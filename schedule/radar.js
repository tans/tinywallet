require("dotenv").config();
const db = require("../db");
const axios = require("axios");
const moment = require("moment");

const checkTx = async (chainId) => {
    const tx = await db.TXS.findOneAndUpdate(
        { chainId, checkStatus: 0 },
        { $set: { checkStatus: 1 } }
    );
    if (!tx) {
        console.log("check tx empty");
        return false;
    }
    for (let item of tx.items) {
        if (item.log_events) {
            for (let log of item.log_events) {
                if (
                    log.sender_contract_ticker_symbol &&
                    log.decoded.name == "Transfer"
                ) {
                    let flow = {
                        symbol: log.sender_contract_ticker_symbol,
                        name: log.sender_name,
                        address: log.sender_address,
                        from: log.decoded.params[0].value,
                        to: log.decoded.params[1].value,
                        value: log.decoded.params[2].value,
                        time: item.block_signed_at,
                        chainId: chainId,
                        blockHeight: item.block_height,
                        hash: item.tx_hash,
                    };
                    await db.TOKEN_FLOWS.insert(flow);
                    console.log(flow);

                    await db.TOKEN_STATS.findOneAndUpdate(
                        {
                            hour: moment(item.block_signed_at).format(
                                "YYYY-MM-DD-HH"
                            ),
                            symbol: log.sender_contract_ticker_symbol,
                        },
                        {
                            $inc: {
                                cnt: 1,
                            },
                        },
                        {
                            upsert: true,
                        }
                    );
                }
            }
        }
    }

    console.log("check tx end");
    return true;
};
module.exports = { checkTx };
if (require.main == module) {
    checkTx(1).then();
}
