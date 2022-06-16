const db = require("../db");
const core = require("../core");
const ethers = require("ethers");
const walletService = require("../services/walletService");

module.exports = {
    walletBalance: async (ctx) => {
        const { network } = ctx.request.params;
        const { address, tokenAddress } = ctx.request.body;

        const number = await core.provider(network).getBalance(address);
        ctx.body = ethers.utils.formatUnits(number, "ether");
    },
    walletSaveSettings: async (ctx) => {
        const { address } = ctx.request.body;
        const wallet = await db.WALLETS.findOne({
            address,
        });
        if (!wallet) {
            return ctx.throw(400, "wallet not exists");
        }

        if (wallet.settings) {
        }
        let settings = wallet.settings;

        settings = Object.assign(settings, ctx.request.body.settings);

        await db.WALLETS.findOneAndUpdate({
            address,
            $set: { settings },
        });

        ctx.body = "ok";
    },
    walletGetSettings: async (ctx) => {
        const { address } = ctx.request.params;
        const wallet = await db.WALLETS.findOne({
            address,
        });
        ctx.body = wallet.settings || {};
    },

    walletAddNetwork: async (ctx) => {
        const { address, network } = ctx.request.body;
        await walletService.addNetwork(address, network);
        ctx.body = "ok";
    },
    walletAddToken: async (ctx) => {
        const { address, network, contractAddress } = ctx.request.body;
        await walletService.addToken(address, network, contractAddress);
        ctx.body = "ok";
    },
    walletBalances: async (ctx) => {
        const { address } = ctx.request.params;
        const wallet = await db.WALLETS.findOne({
            address,
        });
        let balances = wallet.balances;
        if (!balances) {
            balances = await walletService.initBalances(address);
        }
        ctx.body = balances;
    },
    walletPrivate: async (ctx) => {
        const { address, password } = ctx.request.body;
        if (!password) {
            ctx.throw(400, "password required");
        }
        const wallet = await db.WALLETS.findOne({ address });
        const privateKey = await core.wallet.getPrivateKey(
            wallet.private,
            password,
            wallet.iv
        );
        ctx.body = privateKey;
    },
    walletCreate: async (ctx) => {
        let { id, password, privateKey } = ctx.request.body;

        const exists = await db.WALLETS.count({ id });
        if (exists) {
            return ctx.throw(400, "id already exists");
        }
        let { address, iv, private } = core.wallet.generate(
            password,
            privateKey
        );

        await db.WALLETS.insert({
            id,
            iv,
            address,
            private,
        });

        ctx.session.wallet = {
            id: id,
            address: address,
        };

        ctx.body = {
            id: id,
            address: address,
        };
    },

    walletLogin: async (ctx) => {
        let { id, password } = ctx.request.body;

        const wallet = await db.WALLETS.findOne({ id });
        if (!wallet) {
            return ctx.throw(400, "id not exists");
        }
        if (wallet.errorTimes > 5) {
            return ctx.throw(400, "wallet locked, try it later");
        }
        try {
            await core.wallet.getPrivateKey(
                wallet.private,
                password,
                wallet.iv
            );

            ctx.session.wallet = {
                id: id,
                address: wallet.address,
            };

            await db.WALLETS.findOneAndUpdate(
                {
                    id,
                },
                {
                    $set: {
                        errorTimes: 0,
                    },
                }
            );
            return (ctx.body = "ok");
        } catch (err) {
            await db.WALLETS.findOneAndUpdate(
                {
                    id,
                },
                {
                    $inc: { errorTimes: 1 },
                }
            );
            return ctx.throw(400, "password not correct");
        }
    },
};
