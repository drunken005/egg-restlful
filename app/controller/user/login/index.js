const _ = require('lodash');
module.exports = app => {
    class UserLogin extends app.Controller {
        async create() {
            let {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                username: {type: 'string', required: true},
                password: {type: 'object', required: true}
            }, data);

            ctx.validate({
                algorithm: {type: 'string', required: false},
                digest: {type: 'string', required: true}
            }, data.password);

            let result = await ctx.service.user.index.loginWithPassword(data);
            this.success(result);
        }
    }

    return UserLogin;
};