const monk = require("monk");
const DB = monk(process.env.MONGODB);
const PREFIX = process.env.PREFIX;

WALLETS = DB.get(PREFIX + "wallets");

module.exports = {
    WALLETS: WALLETS,
    getPluginCol: (name) => {
        return DB.get(PREFIX + "plugin_" + name);
    },
};
