module.exports = {
    index: async function (ctx) {
        await ctx.render("web/index");
    },
    radarPage: async function (ctx) {
        await ctx.render("radar/index");
    },
    tokenPage: async function (ctx) {
        ctx.state.symbol = ctx.params.symbol;
        await ctx.render("radar/token");
    },

    walletPage: async function (ctx) {
        await ctx.render("wallet/index");
    },
};
