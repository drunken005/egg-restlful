'use strict';
const _ = require('lodash');
const {error, isDoraError, isValidateError} = require('../lib');

let wrapStack = (doraErr, sourceErr) => {
    if (sourceErr) {
        if (sourceErr.stack) {
            doraErr.stack = sourceErr.stack;
        }
        if (sourceErr.path) {
            doraErr.path = sourceErr.path;
        }
    }
    return doraErr;
};

module.exports = (options, app) => {
    return async function errorHandler(ctx, next) {
        try {
            await next();
        } catch (e) {
            let body = {}, status = 500;
            if (isValidateError(e)) {
                e = wrapStack(new error.ParamsErr(null, null, e.errors), e);
            }
            if (isDoraError(e)) {
                body = {
                    statusCode: e.error,
                    msg: e.reason,
                    errorType: e.errorType,
                    detail: e.details,
                    path: e.path
                };
                status = 200;
            } else {
                console.error(e);
                status = e.status || 500;
                body = e.data || {error: e.message};
                if (status === 422) {
                    body = {detail: e.errors};
                }
            }
            ctx.status = status;
            ctx.body = body;
        }
    };
};
