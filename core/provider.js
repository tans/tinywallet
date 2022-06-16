const ethers = require("ethers");

const providers = {};
module.exports = (network) => {
    if (providers[network]) {
        return providers[network];
    }

    providers[network] = new ethers.providers.AlchemyProvider(
        network,
        process.env.ALCHEMY_KEY
    );

    return providers[network];
};
