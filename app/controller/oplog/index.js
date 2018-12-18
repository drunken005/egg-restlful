module.exports = app => {
    class OpLogController extends app.Controller {
        async index() {
            const {ctx} = this;
            let {condition, option} = ctx.formatQueryParams();
            ctx.validate({
                page: {type: 'number'},
                pageSize: {type: 'number'}
            }, option);
            let {list, total} = await ctx.service.oplog.index.getOpLogs(condition, option);
            this.success({
                count: list.length,
                page: option.page,
                total,
                list
            });
        }
    }

    return OpLogController;
};