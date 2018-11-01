const _ = require('lodash');
const random = require('randomstring');
module.exports = app => {
    class ExchangeService extends app.Service {
        constructor(ctx) {
            super(ctx);
        }

        //query exchange list by condition
        async exchangeList(condition, {page, pageSize, sort}) {
            const {ctx} = this;
            let option = ctx.helper.pageOption(page, pageSize, {sort});
            let query = _.pick(condition, ['_id', 'name', 'status']);
            let list = await ctx.model.Exchange.find(query, null, option);
            let total = await ctx.model.Exchange.countDocuments(condition);
            return {list, total};
        }

        //insert new exchange info
        async insertExchange(data) {
            const {ctx} = this;
            data = _.assign({
                _id: '0' + await ctx.generatorId('exchange'),
                createdAt: new Date(),
                status: 'normal'
            }, data);
            return await ctx.model.Exchange.create(data);
        }

        //get one exchange by _id
        async getExchangeById(_id, fields = {}) {
            const {ctx} = this;
            let data = await ctx.model.Exchange.findById(_id, fields);
            return app.formatData(data);
        }

        //update exchange info by _id
        async updateExchangeById(_id, modifier) {
            const {ctx} = this;
            if (!modifier || _.isEmpty(modifier)) {
                throw new ctx.error.BusinessErr(null, '更新数据失败，数据未发生改变', 'update exchange error, data no change')
            }
            let {nModified} = await ctx.model.Exchange.updateOne({_id}, modifier);
            return !!nModified;
        }

        //freeze exchange by id list
        async freeze(exchangeIds) {
            const {ctx} = this;
            console.log(exchangeIds);


            //TODO 1.call CXP EOS chain contract execute freeze
            //TODO 2.change exchange status
            //TODO 3.create operate logs

            let {nModified} = await ctx.model.Exchange.updateMany({_id: {$in: exchangeIds}}, {$set: {status: 'freeze'}});
            console.log(nModified);

            return {warning: '冻结请求发送成功,当前操作只更新了数据库状态，未调用EOS智能合约.合约开发中...'}
        }


        //unfreeze exchange by id list
        async unfreeze(exchangeIds) {
            const {ctx} = this;
            console.log(exchangeIds);
            //TODO 1.call CXP EOS chain contract execute unfreeze
            //TODO 2.change exchange status
            //TODO 3.create operate logs

            let {nModified} = await ctx.model.Exchange.updateMany({_id: {$in: exchangeIds}}, {$set: {status: 'normal'}});
            console.log(nModified);

            return {warning: '解冻请求发送成功,当前操作只更新了数据库状态，未调用EOS智能合约.合约开发中...'}
        }

    }

    return ExchangeService;
};