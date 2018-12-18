// const EosAgentCore = require('./app/lib/eos_agent/EosAgentCore');

module.exports = app => {

    app.beforeStart(async () => {
        //do something
        // let {eos} = app.config;
        // const cxpEos = EosAgentCore(eos.account, eos.httpEndpoint, eos.keyProvider);
        // app.cxpEox = cxpEos;
    });

    class BaseController extends app.Controller {
        success (data) {
            this.ctx.body = {
                success: true,
                msg: 'OK',
                statusCode: 200,
                data: app.formatData(data),
            };
        }

        showPage(page){
            this.ctx.body = page;
        }

        notFound (msg) {
            msg = msg || 'not found';
            this.ctx.throw(404, msg);
        }
    }
    app.Controller = BaseController;
};
