module.exports = app => {
    class UserController extends app.Controller {

        async index() {
            const {ctx} = this;
            let {condition, option} = ctx.formatQueryParams();
            ctx.validate({
                page: {type: 'number', required: true},
                pageSize: {type: 'number', required: true}
            }, option);
            let {list, total} = await ctx.service.user.index.userList(condition, option);
            this.success({
                count: list.length,
                page: option.page,
                total,
                list
            });
        }

        async edit() {
            const {ctx} = this;
            const {id} = ctx.params;
            let data = await ctx.service.user.index.getUserEditInfo(id);
            this.success(data);
        }

        async update() {
            const {ctx} = this;
            let body = ctx.request.body;
            let {id} = ctx.params;
            ctx.validate({
                modifier: {type: 'object', required: true}
            }, body);
            let {modifier} = body;
            let data = await ctx.service.user.index.updateUserById(id, modifier);
            this.success(data);
        }
    }

    return UserController;
};
