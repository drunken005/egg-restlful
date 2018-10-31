const Account = require('account-password');
const _ = require('lodash');
module.exports = app => {
    class UserService extends app.Service {
        constructor(ctx) {
            super(ctx);
        }

        async resume(token) {
            const {ctx} = this;
            const account = new Account(ctx.model.User);
            let res;
            try {
                res = await account.loginWithToken({resume: token});
            } catch (e) {
                if (e.message === 'Token expired') {
                    throw new ctx.error.AuthCheckErr.LoginErr('token-expired', null, 'Your session has expired. Please log in again.');
                } else {
                    throw new ctx.error.AuthCheckErr.LoginErr('not-logged-in', null);
                }
            }
            if (!res) {
                throw new ctx.error.AuthCheckErr.LoginErr('token-expired', null, 'Your session has expired. Please log in again.');
            }
            return res;
        }

        async loginWithPassword(data) {
            const {ctx} = this;
            let account = new Account(ctx.model.User);
            let res;
            try {
                res = await account.loginWithPassword(data);
                res.tokenExpires = new Date(res.tokenExpires).format('yyyy-MM-dd hh:mm:ss.S');
            } catch (e) {
                if (e.message === 'User not found') {
                    throw new ctx.error.AuthCheckErr.LoginErr('not-registered', null, "You've been not register. Please register again.")
                } else if (e.message === 'Incorrect password') {
                    throw new ctx.error.AuthCheckErr.LoginErr('password-error', null, "Incorrect password");
                } else {
                    throw new ctx.error.AuthCheckErr.LoginErr('login-failed', null, "login failed");
                }
            }
            if (res && res.id) {
                let user = await ctx.model.User.findById(res.id, ['_id', 'createdAt', 'username', 'mobile']);
                res.user = user;
            }
            return res;
        }
    }

    return UserService;
};