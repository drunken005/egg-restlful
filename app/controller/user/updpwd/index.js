module.exports = app => {
    class UserUpdatePassword extends app.Controller {
        async create() {
            const {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                password: {type: 'object', required: true}
            }, data);

            ctx.validate({
                algorithm: {type: 'string', required: false},
                digest: {type: 'string', required: true}
            }, data.password);

            let result = await ctx.service.user.index.resetPassword(data);
            this.success(result);
        }
    }

    return UserUpdatePassword;
};