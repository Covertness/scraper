const Router = require('@koa/router');

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
    const page = await ctx.browser.newPage();
    await page.goto(`https://weibo.com/u/${ctx.params['id']}`);
    try {
        await page.waitForSelector('.WB_detail', {timeout: 10000});
    } catch {
        ctx.body = [];
        return;
    }

    const items = await page.evaluate(() => {
        const SELECTOR = '.WB_detail';
        
        const elements = Array.from(document.querySelectorAll(SELECTOR));

        return elements.map((element) => {
            const item = {};

            const NAME_SELECTOR = ".W_fb";
            item.name = element.querySelector(NAME_SELECTOR).textContent;

            const TEXT_SELECTOR = ".WB_text";
            item.text = element.querySelector(TEXT_SELECTOR).textContent.trim();

            const TIMESTAMP_SELECTOR = '.WB_from';
            item.timestamp = element.querySelector(TIMESTAMP_SELECTOR).firstElementChild.getAttribute('date');

            item.id = element.querySelector(TIMESTAMP_SELECTOR).firstElementChild.getAttribute('name');

            return item;
        });
    });

    page.close();

    ctx.body = items;
});

module.exports = weiboRouter;