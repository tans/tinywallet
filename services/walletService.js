const db = require("../db");
const core = require("../core");
const ethers = require("ethers");

const erc20abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
];

module.exports = {
    initBalances: async (address) => {
        let wallet = await db.WALLETS.findOne({ address });
        if (wallet.balances) {
            return wallet.balances;
        }
        await db.WALLETS.findOneAndUpdate(
            { address },
            {
                $set: { balances: {} },
            }
        );

        await module.exports.addNetwork(address, "ropsten");
        await module.exports.addNetwork(address, "homestead");

        wallet = await db.WALLETS.findOne({ address });
        return wallet.balances;
    },
    refreshBalances: async (address) => {},
    addNetwork: async (address, network) => {
        const wallet = await db.WALLETS.findOne({ address });
        if (wallet.balances[network]) {
            return;
        }

        const number = await core.provider(network).getBalance(address);
        const hex = number.toHexString();
        const $set = {};

        $set["balances." + network] = {
            balance: {
                value: hex,
                uptime: Date.now(),
            },
        };
        await db.WALLETS.findOneAndUpdate(
            { address },
            {
                $set,
            }
        );
        return;
    },
    addToken: async (address, network, contractAddress) => {
        const wallet = await db.WALLETS.findOne({ address });
        if (!wallet.balances[network]) {
            await module.exports.addNetwork(address, network);
        }

        if (wallet.balances[network][contractAddress]) {
            return;
        }

        let contract = new ethers.Contract(
            contractAddress,
            erc20abi,
            await core.provider(network)
        );
        const balance = await contract.balanceOf(address);
        const decimal = await contract.decimals();
        const symbol = await contract.symbol();

        let $set = {};
        // danger to update
        $set["balances." + network + "." + contractAddress] = {
            balance: {
                value: balance.toHexString(),
                uptime: Date.now(),
            },
            decimal: decimal,
            symbol: symbol,
        };

        await db.WALLETS.findOneAndUpdate({ address }, { $set });
    },
};
