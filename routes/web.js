module.exports = {
    index: async (ctx) => {
        await ctx.render("web/index");
    },
    doc: async (ctx) => {
        await ctx.render("doc");
    },

    walletCreate: async (ctx) => {
        await ctx.render("wallet/create");
    },
    walletLogin: async (ctx) => {
        await ctx.render("wallet/login");
    },
    walletLogout: async (ctx) => {
        ctx.session.wallet = null;
        await ctx.redirect("/wallet/login");
    },

    walletHome: async (ctx) => {
        await ctx.render("wallet/home");
    },

    walletSettings: async (ctx) => {
        await ctx.render("wallet/settings");
    },

    walletPlugins: async (ctx) => {
        await ctx.render("wallet/plugins");
    },

    walletTransations: async (ctx) => {
        await ctx.render("wallet/transations");
    },

    walletSend: async (ctx) => {
        await ctx.render("wallet/send");
    },
    walletEarn: async (ctx) => {
        await ctx.render("wallet/earn");
    },
};
