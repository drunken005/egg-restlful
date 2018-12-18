module.exports = app => {
    class InitializePasswordController extends app.Controller {
        async create() {
            const {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                userId: {type: 'string', required: true}
            }, data);

            let result = await ctx.service.user.index.initializePassword(data.userId);
            this.success(result);
        }
    }

    return InitializePasswordController;
};