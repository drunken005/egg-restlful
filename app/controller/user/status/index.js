module.exports = app => {
    class UserStatusController extends app.Controller {
        async update() {
            const {ctx} = this;
            let body = ctx.request.body;
            let {id} = ctx.params;
            ctx.validate({
                ids: {
                    type: 'array',
                    itemType: 'string',
                    required: true
                },
                status: ['normal', 'disable']
            }, body);
            if(!body.ids || !body.ids.length){
                throw new ctx.error.BusinessErr(null, 'Params error, filed `ids` length must be greater than 0')
            }
            let data = await ctx.service.user.index.updateUserStatus(body);
            this.success(data);
        }
    }

    return UserStatusController;
};
