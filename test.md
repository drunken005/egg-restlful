# 文档索引
* [工程目录](#工程目录)
* [安装步骤](#安装步骤)
* [基础环境](#基础环境)
* [安装依赖](#安装依赖)
* [查看依赖](#查看依赖)
* [创建表](#创建表)
* [启动服务](#启动服务)
* [发布版本记录](#发布版本记录)


# 工程目录
工程主要包EOS相关代码，包含gateway，block，confirm及callback四个进程

## 源码目录
| Folder  | Contents |
|---------|----------|
|./common|公共组件
|./config|配置文件
|./connections|连接方法
|./dao|SQL方法
|./logs|工程日志
|./mapping|数据映射
|./middlewares|中间件方法
|./models|数据方法
|./node_modules|模块依赖
|./report|单测报告
|./routes|路由视图
|./schemas|路由参数
|./services|服务入口
|./sql|工程SQL
|./test|单测代码
|./tool|工程工具

# 安装步骤

## 基础环境
```js
$ node --version
v11.2.0

$ npm ls -g --depth 0
/usr/local/lib
├── cnpm@6.0.0
├── npm@6.4.1
└── pm2@3.2.2
```

## 安装依赖
```js
npm install --production
```

## 查看依赖
```js
$ npm ls --depth 0
eos-gateway@1.0.0 /data
+-- bignumber.js@8.0.1
+-- biguint-format@1.0.0
+-- enum@2.5.0
+-- eosjs@20.0.0-beta3
+-- eureka-js-client@4.4.2
+-- flake-idgen@1.1.0
+-- jsonschema@1.2.4
+-- koa@2.6.1
+-- koa-bodyparser@3.2.0
+-- koa-router@7.4.0
+-- koa2-ratelimit@0.7.0
+-- lodash@4.17.11
+-- log4js@3.0.6
+-- moment@2.22.2
+-- moment-timezone@0.5.23
+-- mysql2@1.6.2
+-- node-fetch@2.3.0
+-- request@2.88.0
+-- request-promise@4.2.2
+-- sequelize@4.41.2
`-- uuid@3.3.2
```

## 创建表
    执行./sql目录下`eos_gateway.sql`在本地建立相应表

## 启动服务
```js
pm2 start start.config.js
┌──────────────┬────┬─────────┬──────┬─────┬────────┬─────────┬────────┬──────┬───────────┬──────┬──────────┐
│ App name     │ id │ version │ mode │ pid │ status │ restart │ uptime │ cpu  │ mem       │ user │ watching │
├──────────────┼────┼─────────┼──────┼─────┼────────┼─────────┼────────┼──────┼───────────┼──────┼──────────┤
│ eos-block    │ 0  │ 1.0.0   │ fork │ 18  │ online │ 0       │ 37s    │ 0%   │ 39.6 MB   │ root │ disabled │
│ eos-callback │ 1  │ 1.0.0   │ fork │ 24  │ online │ 0       │ 37s    │ 0%   │ 39.9 MB   │ root │ disabled │
│ eos-confirm  │ 2  │ 1.0.0   │ fork │ 32  │ online │ 0       │ 37s    │ 0%   │ 35.6 MB   │ root │ disabled │
│ eos-gateway  │ 3  │ 1.0.0   │ fork │ 38  │ online │ 0       │ 37s    │ 0.9% │ 53.6 MB   │ root │ disabled │
└──────────────┴────┴─────────┴──────┴─────┴────────┴─────────┴────────┴──────┴───────────┴──────┴──────────┘
```


# 发布版本记录

## [1.0.0]2018-12-24
项目初始化
