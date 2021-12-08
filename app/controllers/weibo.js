const Router = require('@koa/router');
const fetch = require('node-fetch');

const weiboRouter = new Router();

weiboRouter.get('/search/:keyword', async (ctx) => {
    const page = await ctx.browser.newPage();
    await page.goto(`https://s.weibo.com/user?q=${encodeURIComponent(ctx.params['keyword'])}&Refer=weibo_user`);
    await page.waitForSelector('.card-wrap');

    const items = await page.evaluate(() => {
        const SELECTOR = '.card-user-b';
        
        const elements = Array.from(document.querySelectorAll(SELECTOR));

        return elements.map((element) => {
            const item = {};

            const ID_SELECTOR = ".s-btn-c";
            item.id = element.querySelector(ID_SELECTOR).getAttribute('uid');

            const NAME_SELECTOR = ".name";
            item.name = element.querySelector(NAME_SELECTOR).textContent;

            return item;
        });
    });

    page.close();

    ctx.body = items;
});

weiboRouter.get('/:id', async (ctx) => {
    const response = await fetch(`https://m.weibo.cn/profile/info?uid=${ctx.params['id']}`);
    const data = await response.json();

    const items = data.data.statuses.map(status => {
        return {
            name: status.user.screen_name,
            text: status.text,
            timestamp: new Date(status.created_at).getTime(),
            id: status.id,
            link: `https://m.weibo.cn/detail/${status.id}`,
        }
    });

    ctx.body = items;
});

module.exports = weiboRouter;