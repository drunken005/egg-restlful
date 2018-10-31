module.exports = app => {
    class ExchangeController extends app.Controller {
        async create() {
            this.success({success: true})
        }
    }

    return ExchangeController;
};