const monk = require("monk");
const DB = monk(process.env.MONGODB);
const PREFIX = process.env.PREFIX;

WALLETS = DB.get(PREFIX + "wallets");
TXS = DB.get(PREFIX + "txs");
TOKEN_STATS = DB.get(PREFIX + "token_stats");
TOKEN_FLOWS = DB.get(PREFIX + "token_flows");
BLOCK_STATS = DB.get(PREFIX + "block_stats");
ADDRESS_STATS = DB.get(PREFIX + "address_stats");

module.exports = {
    WALLETS: WALLETS,
    BLOCK_STATS: BLOCK_STATS,
    TOKEN_STATS: TOKEN_STATS,
    ADDRESS_STATS: ADDRESS_STATS,
    TXS: TXS,
    TOKEN_FLOWS: TOKEN_FLOWS,
};
