const ethers = require("ethers");
const crypto = require("crypto");

const { Wallet } = ethers;

const md5 = (text) => {
    const hash = crypto.createHash("md5");
    hash.update(text + process.env.SALT);
    return hash.digest("hex");
};
module.exports = {
    generate: (password, privateKey) => {
        const iv = crypto.randomBytes(16);
        const key = md5(md5(md5(password)));
        let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

        const wallet = privateKey
            ? new Wallet(privateKey)
            : ethers.Wallet.createRandom();
        let encrypted = cipher.update(wallet.privateKey);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            address: wallet.address,
            iv: iv.toString("hex"),
            private: encrypted.toString("hex"),
        };
    },

    getPrivateKey: (private, password, iv) => {
        iv = Buffer.from(iv, "hex");
        const key = md5(md5(md5(password)));
        let encryptedText = Buffer.from(private, "hex");

        let decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(key),
            iv
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
};
