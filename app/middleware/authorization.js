module.exports = () => {
    //check authorization
    return async function authorization(ctx, next) {
        let key = ctx.get('Authorization');
        if (!key) {
            throw new ctx.error.AuthorizationErr.AuthKeyErr('auth-key-missing')
        }

        if (key !== ['CXP', ctx.app.config.app_key].join('-')) {
            throw new ctx.error.AuthorizationErr.AuthKeyErr('auth-key-error');
        }

        await next();
    };
};