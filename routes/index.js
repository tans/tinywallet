const Router = require("koa-router");

const router = new Router();
const web = require("./web");
const wallet = require("./wallet");
const radar = require("./radar");

router.get("/", web.index);
router.get("/radar", web.radarPage);
router.get("/token/:chainId/:symbol", web.tokenPage);
router.get("/wallet", web.walletPage);
router.get("/api/radar/flows", radar.getFlows);
router.get("/api/radar/flows/:chainId/:symbol", radar.getFlowsBySymbol);
router.get("/api/radar/stats/:chainId/:symbol", radar.getStatsBySymbol);
router.get("/api/radar/skyrockets", radar.getSkyrockets);

module.exports = router;
