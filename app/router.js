const {apis} = require('./lib');
module.exports = app => {
    const noAuthCheck = [
        'home',
        'user.login'
    ];
    apis.routerApi.registerRouter(app, noAuthCheck);
};