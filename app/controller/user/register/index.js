const Account = require('acccount-password');

module.exports = app => {
    class UserRegister extends app.Controller {
        async create() {
            let {ctx} = this;
            let data = ctx.request.body;
            let account = new Account(ctx.model.User);
            let res = await account.createUser(data);
            console.log(res);
            // let insert = await ctx.model.User.create({
            //     _id: random.generate(17),
            //     ...
            // });

            this.success(data)
        }
    }

    return UserRegister;
};