const Koa = require('koa');
const Router = require('@koa/router');
const json = require('koa-json')
const puppeteer = require('puppeteer');

const weiboRouter = require('./app/controllers/weibo');

const app = new Koa();
const router = new Router();

router.use('/weibo', weiboRouter.routes(), weiboRouter.allowedMethods());

async function run() {
    app.context.browser = await puppeteer.launch({headless: true});

    app.use(json()).use(router.routes()).use(router.allowedMethods());

    const port = process.env["PORT"] || 3000;
    app.listen(port);
    console.log(`server listen on port: ${port}`);
}

run();