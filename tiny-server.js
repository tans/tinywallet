require("dotenv").config();

const Koa = require("koa");
const serve = require("koa-static");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = new Koa();
const render = require("koa-ejs");
const router = require("./routes");

render(app, {
    root: path.join(__dirname, "views"),
    layout: "layout",
    viewExt: "html",
    map: { html: "ejs" },
    cache: false,
    debug: false,
});

app.use(serve(path.join(__dirname, "public")));
app.use(router.routes());
const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
    /* options */
});

io.on("connection", (socket) => {
    console.log(socket.id);
});

httpServer.listen(process.env.PORT);
