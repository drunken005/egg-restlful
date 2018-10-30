module.exports = app => {
    class HomeController extends app.Controller {
        async index () {
            let {ctx} = this;
            this.showPage('<h1>COINXP Exchange ms<h1>');
        }
    }
    return HomeController;
};
