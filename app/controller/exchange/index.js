module.exports = app => {
    class ExchangeController extends app.Controller {

        async index() {
            const {ctx} = this;
            let {condition, option} = ctx.formatQueryParams();
            ctx.validate({
                page: {type: 'number', required: true},
                pageSize: {type: 'number', required: true}
            }, option);
            let {list, total} = await ctx.service.exchange.index.exchangeList(condition, option);
            this.success({
                count: list.length,
                page: option.page,
                total,
                list
            });
        }

        async create() {
            const {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                name: {type: 'string', require: true},
                short_name: {type: 'string', require: true},
                logo: {type: 'string', require: true},
                address: {type: 'string', require: true},
                contact_name: {type: 'string', require: true},
                contact_mobile: {type: 'string', require: true},
                website: {type: 'string', require: true},
                account: {type: 'string', require: true},
            }, data);
            let res = await ctx.service.exchange.index.insertExchange(data);
            this.success(res);
        }

        async edit() {
            const {ctx} = this;
            const {id} = ctx.params;
            let data = await ctx.service.exchange.index.getExchangeById(id, {createdAt: 0});
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
            let data = await ctx.service.exchange.index.updateExchangeById(id, modifier);
            this.success(data);
        }

    }

    return ExchangeController;
};