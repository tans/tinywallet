module.exports = {
    apps: [
        {
            namespace: "tinywallet",
            name: "tiny-server",
            script: "tiny-server.js",
        },
        {
            namespace: "tinywallet",
            name: "tiny-cron",
            script: "tiny-cron.js",
        },
        {
            namespace: "tinywallet",
            name: "tiny-token",
            script: "tiny-cron.js",
            args: "token",
        },
        {
            namespace: "tinywallet",
            name: "tiny-tx",
            script: "tiny-cron.js",
            args: "tx",
        },
        {
            namespace: "tinywallet",
            name: "tiny-tx2",
            script: "tiny-cron.js",
            args: "tx2",
        },
    ],
};
