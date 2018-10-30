'use strict';
const path = require('path');

module.exports = appInfo => {
    return {
        keys: appInfo.name + '_1538988032206_7794',
        middleware: ['errorHandler', 'loginCheck'],
        errorHandler: {
            match: /\/(app|api)/
        },
        loginCheck: {
            match: '/api'
        },
        authCheck: '/api/',
        noAuthCheck: '/app/',
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
            url: 'mongodb://127.0.0.1/coinxp',
            options: {
                autoReconnect: true,
                reconnectTries: 10, // Never stop trying to reconnect
                reconnectInterval: 500, // Reconnect every 500ms
                poolSize: 10, // Maintain up to 10 socket connections
                bufferMaxEntries: 0
            }
        },
    }

};