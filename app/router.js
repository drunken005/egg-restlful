const {apis} = require('./lib');
module.exports = app => {
    const noAuthCheck = [
        'home',
        'user.login',
        'user.register'
    ];
    apis.routerApi.registerRouter(app, noAuthCheck);
};