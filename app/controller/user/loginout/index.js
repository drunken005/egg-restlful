const _ = require('lodash');
module.exports = app => {
    class UserLogin extends app.Controller {
        async create() {
            let {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                userId: {type: 'string', required: true}
            }, data);
            let result = await ctx.service.user.index.loginOut(data.userId);
            this.success(result);
        }
    }

    return UserLogin;
};