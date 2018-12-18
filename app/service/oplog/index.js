const _ = require('lodash');

module.exports = app => {
    class OpLogService extends app.Service {

        async getOpLogs(condition, {page, pageSize, sort}) {
            const {ctx} = this;
            let option = ctx.helper.pageOption(page, pageSize, {sort});
            let query = _.pick(condition, ['coll', 'action', 'condition', 'method']);

            let list = await ctx.model.OpLog.find(query, null, option);
            let total = await ctx.model.OpLog.countDocuments(condition);
            return {list, total};
        }
    }

    return OpLogService;
};