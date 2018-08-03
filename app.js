const Koa = require('koa')
const Router = require('koa-router')
const polyvRoute = require('./src/routes/polyv')
const app = new Koa()
const router = new Router();

polyvRoute(router)

app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3000)
