const Account = require('acccount-password');
module.exports = app => {
    class UserLogin extends app.Controller {
        async create() {
            let {ctx} = this;
            let data = ctx.request.body;
            let account = new Account(ctx.model.User);
            let res = await account.loginWithPassword(data);
            // console.log(res);
            this.success(res)
        }
    }

    return UserLogin;
};