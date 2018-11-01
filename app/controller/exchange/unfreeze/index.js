module.exports = app => {
    class ExchangeUnfreezeController extends app.Controller {
        async create() {
            const {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                ids: {
                    type: 'array',
                    itemType: 'string',
                    required: true
                }
            }, data);
            let res = await ctx.service.exchange.index.unfreeze(data.ids);
            this.success(res);
        }
    }

    return ExchangeUnfreezeController;
};