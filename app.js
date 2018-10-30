module.exports = app => {

    app.beforeStart(async () => {
        //do something
    });

    class BaseController extends app.Controller {
        success (data) {
            this.ctx.body = {
                success: true,
                msg: 'OK',
                statusCode: 200,
                data,
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
