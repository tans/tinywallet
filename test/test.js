require("dotenv").config();
var assert = require("assert");
var ethers = require("ethers");
var wallet = require("../core/wallet");

var network = "ropsten";

const erc20abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
];

// const provider = new ethers.providers.InfuraProvider(
//     network,
//     process.env.INFURA_PROJECTID
// );

const provider = new ethers.providers.AlchemyProvider(
    network,
    process.env.ALCHEMY_KEY
);
describe("Test1", async function () {
    this.timeout(5000);

    it("1", async function () {
        const wethContract = new ethers.Contract(
            "0xc778417e063141139fce010982780140aa0cd5ab",
            erc20abi,
            provider
        );

        const balance = await wethContract.balanceOf(
            "0xFF7bf541a59937F738434bcDA481533e3b5b9471"
        );
        const decimal = await wethContract.decimals();
        const symbol = await wethContract.symbol();
        console.log(decimal);
        console.log(ethers.utils.formatUnits(balance, decimal));
        console.log(symbol);
    });

    it("2", async function () {
        const wethContract = new ethers.Contract(
            "0xc778417e063141139fce010982780140aa0cd5ab",
            erc20abi,
            provider
        );

        const balance = await wethContract.balanceOf(
            "0xFF7bf541a59937F738434bcDA481533e3b5b9471"
        );
        const decimal = await wethContract.decimals();
        const symbol = await wethContract.symbol();
        console.log(decimal);
        console.log(ethers.utils.formatUnits(balance, decimal));
        console.log(symbol);
    });
});
