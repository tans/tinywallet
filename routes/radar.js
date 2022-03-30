const moment = require("moment");
const _ = require("lodash");
const db = require("../db");
module.exports = {
    getFlows: async (ctx) => {
        let flows = await db.TOKEN_FLOWS.find(
            {},
            { sort: { _id: -1 }, limit: 200 }
        );
        ctx.body = flows;
    },
    getFlowsBySymbol: async (ctx) => {
        let { chainId, symbol } = ctx.params;
        let flows = await db.TOKEN_FLOWS.find(
            { symbol: symbol },
            { sort: { _id: -1 }, limit: 200 }
        );
        ctx.body = flows;
    },
    getStatsBySymbol: async (ctx) => {
        let { chainId, symbol } = ctx.params;
        let stats = await db.TOKEN_STATS.find(
            { symbol: symbol },
            { sort: { hour: -1 }, limit: 20 }
        );
        ctx.body = stats;
    },
    getSkyrockets: async (ctx) => {
        let symbols = await db.TOKEN_STATS.distinct("symbol", {
            hour: { $gt: moment().add(-6, "hours").format("YYYY-MM-DD-HH") },
            cnt: { $gt: 50, $lt: 150 },
        });

        symbols = _.sampleSize(symbols, 12);
        let stats = [];
        for (let symbol of symbols) {
            let stat = await db.TOKEN_STATS.find(
                { symbol: symbol, cnt: { $gt: 2 } },
                { sort: { hour: -1 }, limit: 20 }
            );

            if (stat.length < 3) {
                continue;
            }
            let ban = false;
            data = stat.map((i) => {
                if (i > 1000) {
                    ban = true;
                }
                return i.cnt;
            });

            if (ban) {
                continue;
            }

            stats.push({
                symbol: symbol,
                data: data,
            });
        }

        stats = _.sampleSize(stats, 6);
        ctx.body = stats;
    },
};
