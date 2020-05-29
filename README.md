# scraper

基于 puppeteer 实现的网络爬虫，目前支持：
- 微博：帐号搜索，个人首页

## 启动
```bash
$ npm i
$ npm start
```

## 接口
### 微博
#### 帐号搜索
```bash
$ curl "http://127.0.0.1:3000/weibo/search/love"
```

#### 个人首页
```bash
$ curl "http://127.0.0.1:3000/weibo/1618051664"
```