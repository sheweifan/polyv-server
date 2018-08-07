const Koa = require('koa')
const Router = require('koa-router')
var cors = require('koa-cors')
const polyvRoute = require('./src/routes/polyv')
const app = new Koa()
const router = new Router();

app.use(cors())

polyvRoute(router)

app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3000)
