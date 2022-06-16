require("dotenv").config();

const Koa = require("koa");
const serve = require("koa-static");
const { createServer } = require("http");
// const { Server } = require("socket.io");
const path = require("path");
const app = new Koa();
const render = require("koa-ejs");
const koaBody = require("koa-body");
const router = require("./routes");
const session = require("koa-session-minimal");
const MongoStore = require("koa-generic-session-mongo");

const BANNER = `
████████╗██╗███╗   ██╗██╗   ██╗██╗    ██╗ █████╗ ██╗     ██╗     ███████╗████████╗
╚══██╔══╝██║████╗  ██║╚██╗ ██╔╝██║    ██║██╔══██╗██║     ██║     ██╔════╝╚══██╔══╝
   ██║   ██║██╔██╗ ██║ ╚████╔╝ ██║ █╗ ██║███████║██║     ██║     █████╗     ██║
   ██║   ██║██║╚██╗██║  ╚██╔╝  ██║███╗██║██╔══██║██║     ██║     ██╔══╝     ██║
   ██║   ██║██║ ╚████║   ██║   ╚███╔███╔╝██║  ██║███████╗███████╗███████╗   ██║
`;
render(app, {
    root: path.join(__dirname, "views"),
    layout: "layout",
    viewExt: "html",
    map: { html: "ejs" },
    cache: false,
    debug: false,
});

app.use(
    koaBody({
        multipart: true,
        formLimit: "5mb",
        jsonLimit: "5mb",
        textLimit: "5mb",
    })
);
app.use(async (ctx, next) => {
    console.log(ctx.method, ctx.path);
    await next();
});
app.use(
    session({
        store: new MongoStore({
            url: process.env.MONGODB,
            collection: process.env.PREFIX + "sessions",
        }),
    })
);

app.use(
    serve(path.join(__dirname, "public"), {
        maxage: 1, //1000 * 60 * 60 * 24 * 30
    })
);
app.use(router.routes());
const httpServer = createServer(app.callback());
// const io = new Server(httpServer, {
//     /* options */
// });

// io.on("connection", (socket) => {
//     console.log(socket.id);
// });

httpServer.listen(process.env.PORT);
console.log(BANNER);
