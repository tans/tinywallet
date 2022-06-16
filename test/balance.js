const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

// Using HTTP
const web3 = createAlchemyWeb3(
    "https://eth-ropsten.alchemyapi.io/v2/BvQvN8ip15b6aaUXJVtFFBkfekHtLoKb"
);

const ROPSTEN_WETH = "0xc778417e063141139fce010982780140aa0cd5ab";
const main = async () => {
    // Wallet address
    const address = "0xFF7bf541a59937F738434bcDA481533e3b5b9471";

    // Get token balances
    const balances = await web3.alchemy.getTokenBalances(address, [
        ROPSTEN_WETH,
    ]);

    // Remove tokens with zero balance
    const nonZeroBalances = balances["tokenBalances"].filter((token) => {
        return token["tokenBalance"] !== "0";
    });

    console.log(`Token balances of ${address} \n`);

    // Counter for SNo of final output
    let i = 1;

    // Loop through all tokens with non-zero balance
    for (token of nonZeroBalances) {
        // Get balance of token
        let balance = token["tokenBalance"];

        // Get metadata of token
        const metadata = await web3.alchemy.getTokenMetadata(
            token["contractAddress"]
        );

        // Compute token balance in human-readable format
        balance = balance / Math.pow(10, metadata["decimals"]);
        balance = balance.toFixed(2);

        // Print name, balance, and symbol of token
        console.log(`${i++}. ${metadata["name"]}: ${balance}
       ${metadata["symbol"]}`);
    }
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
