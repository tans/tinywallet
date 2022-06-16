require("dotenv").config();

const core = require("../core");
const ethers = require("ethers");

const provider = core.provider("ropsten");

(async () => {
    const wallet = await new ethers.Wallet(
        process.env.TEST_PRIVATEKEY,
        provider
    );
    const recAddress = "0x9b1E0Dd888A3ed80510fFC78393E927B5CF496b9";

    const tx = await wallet.sendTransaction({
        to: recAddress,
        value: ethers.utils.parseEther("0.3"),
    });

    provider.once(tx.hash, (data) => {
        console.log("once");
        console.log(data);
    });
})();
