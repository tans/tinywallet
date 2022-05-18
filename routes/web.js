module.exports = {
    index: async function (ctx) {
        await ctx.render("web/index");
    },
    walletPage: async function (ctx) {
        await ctx.render("wallet/index");
    },
};
