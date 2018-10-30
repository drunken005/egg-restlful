'use strict';
module.exports = appInfo => {
    return {
        keys: appInfo.name + '_1538988032206_7794',
        middleware: [],
        security: {
            csrf: {
                queryName: '_csrf',
                bodyName: '_csrf',
                headerName: 'x-csrf-token',
                ignoreJSON: true
            },
            domainWhiteList: ['http://localhost:7001', "http://127.0.0.1:7001", "http://faucet.coinxp.io"]
        }
    }
};
