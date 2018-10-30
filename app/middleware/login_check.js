module.exports = () => {
    //check user is login and token expires
    return async function authCheck (ctx, next) {
        let token = ctx.get('token');
        if (!token) {
            throw new ctx.error.AuthCheckErr.LoginErr('not-logged-in', null, "You've been logged out by the server. Please login in again.")
        }
        let check = await ctx.service.users.index.resume(token);
        ctx._userId = check.userId;
        ctx.token = check.token;

        let req = ctx.req;
        let headers = req.headers;
        ctx.ipV4 = headers['x-forwarded-for'] ||
            (req.connection && req.connection.remoteAddress) ||
            (req.socket && req.socket.remoteAddress) ||
            req.connection && req.connection.socket && req.connection.socket.remoteAddress;

        await next();
    };
};