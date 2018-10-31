module.exports = app => {
    class UserLogin extends app.Controller {
        async create() {
            let {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                username: {type: 'string', require: true},
                password: {type: 'string', require: true}
            }, data);
            let result = await ctx.service.user.index.loginWithPassword(data);
            this.success(result);
        }
    }

    return UserLogin;
};