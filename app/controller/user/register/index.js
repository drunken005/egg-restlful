
module.exports = app => {
    class UserRegister extends app.Controller {
        async create() {
            let {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                name: {type: 'string', required: true},
                username: {type: 'string', required: true},
                mobile: {type: 'string', required: true},
                role: {type: 'string', required: true},
                status: {type: 'string', required: true}
            }, data);
            let res = await ctx.service.user.index.createNewUser(data);
            this.success(res)
        }
    }

    return UserRegister;
};