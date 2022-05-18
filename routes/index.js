const Router = require("koa-router");

const router = new Router();
const web = require("./web");
const wallet = require("./wallet");
const doc = require("./doc");
const api = require("./api");

router.get("/", web.index);
router.get("/wallet", web.walletPage);
router.get("/doc", doc.docPage);

module.exports = router;
