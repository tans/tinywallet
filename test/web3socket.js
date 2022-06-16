// Installation: https://github.com/alchemyplatform/alchemy-web3
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

// Initialize alchemy-web3 object.
const web3 = createAlchemyWeb3(
    `wss://eth-mainnet.alchemyapi.io/v2/BvQvN8ip15b6aaUXJVtFFBkfekHtLoKb`
);

// Subcribes to the event and prints results
web3.eth
    .subscribe("alchemy_newFullPendingTransactions")
    .on("data", (data) => console.log(data));
