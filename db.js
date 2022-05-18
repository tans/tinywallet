const monk = require("monk");
const DB = monk(process.env.MONGODB);
const PREFIX = process.env.PREFIX;

WALLETS = DB.get(PREFIX + "wallets");

module.exports = {
    WALLETS: WALLETS,
};
