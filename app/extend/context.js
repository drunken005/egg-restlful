const {error} = require('../lib');
const querystring = require('querystring');
const _ = require('lodash');

module.exports = {

    error,

    formatQueryParams() {
        let urls = this.url.split('?');
        if (urls.length <= 1) {
            return {};
        }
        let escape = querystring.unescape(urls[1]);
        let params = querystring.parse(escape);
        _.each(params, (v, k) => {
            if (_.isString(params[k])) {
                params[k] = JSON.parse(v);
            }
        });
        return params;
    },

    //generator unique _id
    async generatorId(type) {
        let ctx = this;
        if (!type)
            return ctx.app.randomId();
        let code = await ctx.model.UniqueCode.findOne({_id: type});
        code = ctx.app.formatData(code);
        if (!code || !code.generator || !code.generator._id) {
            console.error(`query ${type} code does not exist, please create the code type first`);
            return ctx.app.randomId();
        }
        let maxId = code.generator._id + 1;
        let upd = await ctx.model.UniqueCode.update({_id: type}, {'generator._id': maxId});
        if (!upd.nModified) {
            return app.randomId();
        }
        return maxId.toString();
    }
};