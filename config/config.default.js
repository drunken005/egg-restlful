'use strict';

const {MONGO_URL} = process.env;
const LOGIN_EXPIRATION_DAYS = 3;
const appInfo = {
    app_key: '2V7LIL815RCQOGJ6FJ5BG15A86AD9X1XHTQ1G6L84CM9LB1SRSGRCWYAZYYON5HD',
    keys: 'Z0iyGpEYDjWPy3mFBZtNrogtBnoON5GgDcjHIOaPGTSs',
    middleware: ['errorHandler', 'authorization', 'loginCheck'],
    authorization: {
        match: /\/(app|api)/
    },
    errorHandler: {
        match: /\/(app|api)/
    },
    loginCheck: {
        match: '/api'
    },
    authCheck: '/api/',
    noAuthCheck: '/app/',

    //if use http/https cookies session must be config credentials
    cors: {
        credentials: true,
        allowMethods: 'GET,POST,PUT,DELETE,OPTIONS',
    },

    security: {
        csrf: {
            queryName: '_csrf',
            bodyName: '_csrf',
            headerName: 'x-csrf-token',
            ignoreJSON: true
        },
        domainWhiteList: ['http://localhost:3000']
    },
    mongoose: {
        url: MONGO_URL,
        options: {
            useNewUrlParser: true,
            autoReconnect: true,
            reconnectTries: 10, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            bufferMaxEntries: 0
        }
    },
    //user token expiration days
    account: {
        LOGIN_EXPIRATION_DAYS
    },

    //see document https://eggjs.org/zh-cn/core/cookie-and-session.html
    cookies: {
        overwrite: true,
        httpOnly: true,
        signed: true,
        encrypt: true
    }
};

module.exports = appInfo;