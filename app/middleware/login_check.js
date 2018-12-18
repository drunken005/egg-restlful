module.exports = () => {
    //check user is login and token expires
    return async function authCheck(ctx, next) {
        let token = ctx.getToken();
        if (!token) {
            throw new ctx.error.AuthCheckErr.LoginErr('not-logged-in', null, "You've been logged out by the server. Please login in again.")
        }
        let check = await ctx.service.user.index.resume(token);
        ctx._userId = check.userId;
        ctx.token = check.token;
        await next();
    };
};