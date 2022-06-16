const Router = require("koa-router");

const router = new Router();
const web = require("./web");
const doc = require("./doc");
const api = require("./api");

const checkLogin = async (ctx, next) => {
    if (ctx.session.wallet) {
        ctx.state.wallet = ctx.session.wallet;
        ctx.state.layout = "layout_wallet";
        return await next();
    }
    ctx.redirect("/wallet/login");
};

const checkApi = async (ctx, next) => {
    let address = null;
    if (ctx.method == "POST") {
        address = ctx.request.body.address;
    } else {
        address = ctx.request.params.address;
    }

    if (!address) {
        return ctx.throw(400, "address required");
    }
    if (ctx.session.wallet && ctx.session.wallet.address == address) {
        return await next();
    }
    return ctx.throw(401, "access denied");
};

router.get("/", web.index);
router.get("/doc", doc.docPage);

router.get("/wallet/create", web.walletCreate);
router.get("/wallet/login", web.walletLogin);
router.get("/wallet/logout", web.walletLogout);
router.get("/wallet/home", checkLogin, web.walletHome);
router.get("/wallet/settings", checkLogin, web.walletSettings);
router.get("/wallet/transations", checkLogin, web.walletTransations);
router.get("/wallet/plugins", checkLogin, web.walletPlugins);
router.get("/wallet/earn", checkLogin, web.walletEarn);
router.get("/wallet/send", checkLogin, web.walletSend);

router.post("/api/wallet/create", api.walletCreate);
router.post("/api/wallet/login", api.walletLogin);
router.post("/api/wallet/private", checkApi, api.walletPrivate);
router.post("/api/wallet/:network/settings", checkApi, api.walletBalance);
router.get("/api/wallet/:address/settings", checkApi, api.walletGetSettings);
router.post("/api/wallet/settings", checkApi, api.walletSaveSettings);
router.get("/api/wallet/:address/balances", checkApi, api.walletBalances);
router.post("/api/wallet/balances/token/add", checkApi, api.walletAddToken);

module.exports = router;
