const {error} = require('../lib');
const querystring = require('querystring');
const _ = require('lodash');


const LOG_COLLECTIONS = ['exchanges', 'users', 'user', 'trade_pairs'];

module.exports = {

    error,

    //format GET request params
    formatQueryParams() {
        let urls = this.url.split('?');
        if (urls.length <= 1) {
            return {};
        }
        let escape = querystring.unescape(urls[1]);
        let params = querystring.parse(escape);
        _.each(params, (v, k) => {
            if (_.isString(params[k])) {
                params[k] = JSON.parse(v);
            }
        });
        return params;
    },

    //generator unique _id
    async generatorId(type) {
        let ctx = this;
        if (!type)
            return ctx.app.randomId();
        let code = await ctx.model.UniqueCode.findOne({_id: type});
        code = ctx.app.formatData(code);
        if (!code || !code.generator || !code.generator._id) {
            console.error(`query ${type} code does not exist, please create the code type first`);
            return ctx.app.randomId();
        }
        let maxId = code.generator._id + 1;
        let upd = await ctx.model.UniqueCode.update({_id: type}, {'generator._id': maxId});
        if (!upd.nModified) {
            return app.randomId();
        }
        return maxId.toString();
    },

    //set login user token cookies
    setTokenCookies(token, tokenExpires) {
        let options = this.app.config.cookies;
        let expires = new Date(tokenExpires);
        _.assign(options, {expires});
        this.cookies.set('token', token, options);
    },

    //clear login user token cookies
    clearTokenCookies() {
        this.cookies.set('token', null);
    },

    //get login user token cookies
    getToken() {
        return this.cookies.get('token', {
            signed: true,
            encrypt: true
        });
    },

    //user role auth
    async userRoleAuth(role, group, userId) {
        userId = userId || this._userId;
        if ('string' !== typeof group || !role) {
            return false
        }
        role = _.isArray(role) ? role : [role];
        if (!role.length) {
            return false;
        }

        let user = await this.service.user.index.loadUserRoles(userId);

        if (!user) {
            return false;
        }
        let {roles} = user;
        if (!roles || !roles.length) {
            return false;
        }

        let isAdmin = _.find(roles, (doc) => doc.group === 'admin');
        if (isAdmin && isAdmin.items && isAdmin.items.indexOf('admin') >= 0) {
            return true;
        }

        let userRole = _.find(roles, (doc) => doc.group === group);

        if (!userRole || !userRole.items || !userRole.items.length) {
            return false;
        }
        let {items} = userRole;

        items = items && items.length ? [userRole.group].concat(items) : [userRole.group];

        if (!_.intersection(items, role).length) {
            return false;
        }
        return true;
    },

    async addOpLog(collection, action, condition, data) {
        let ctx = this;
        if (_.isObject(condition)) {
            condition = JSON.stringify(condition);
        }

        if (_.isObject(data)) {
            data = JSON.stringify(data);
        }

        ctx.validate({
            collection: LOG_COLLECTIONS,
            action: ['insert', 'update', 'remove', 'login'],
            condition: {type: 'string', required: false},
            data: {type: 'string'},
        }, {collection, action, condition, data});
        let path = ctx.request.url.split('?')[0];
        let method = ctx.request.method;
        let ipAddress = ctx.helper.getClientIp();
        let handler = ctx.request.body.handler;
        if (!handler || !handler._id) {
            handler = {_id: ctx._userId};
        }

        let log = {
            _id: ctx.app.randomId(),
            coll: collection,
            action,
            condition,
            data,
            method,
            path,
            ipAddress,
            handler,
            createdAt: new Date()
        };
        await ctx.model.OpLog.create(log);
    }
};