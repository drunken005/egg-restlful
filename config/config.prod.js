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
        }
    }
};
