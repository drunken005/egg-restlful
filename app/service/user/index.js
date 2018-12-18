const Account = require('account-password');
const _ = require('lodash');
const random = require('randomstring');

module.exports = app => {
    class UserService extends app.Service {
        constructor(ctx) {
            super(ctx);
        }

        async loadUserRoles(userId) {
            const {ctx} = this;
            userId = userId || ctx._userId;
            let pipes = [
                {$match: {_id: userId}},
                {$lookup: {from: 'roles', localField: 'role', foreignField: '_id', as: 'roles'}},
                {$unwind: {path: '$roles', preserveNullAndEmptyArrays: true}},
                {$project: {_id: 1, roles: '$roles.roles'}},
                {$unwind: {path: '$roles', preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'roles.menus', localField: 'roles', foreignField: '_id', as: 'roles_menus'}},
                {$unwind: {path: '$roles_menus', preserveNullAndEmptyArrays: true}},
                {
                    $lookup: {
                        from: 'roles.menus',
                        localField: 'roles_menus.group',
                        foreignField: '_id',
                        as: 'roles_menus_group'
                    }
                },
                {$unwind: {path: '$roles_menus_group', preserveNullAndEmptyArrays: true}},
                {
                    $group: {
                        _id: {_id: '$_id', group_id: '$roles_menus_group._id', group_name: '$roles_menus_group.name'},
                        roles_menu: {$addToSet: {_id: '$roles_menus._id', name: '$roles_menus.name'}}
                    }
                },
                {
                    $group: {
                        _id: {_id: '$_id._id'},
                        roles: {$push: {group: '$_id.group_name', items: '$roles_menu.name'}}
                    }
                },
                {$project: {_id: '$_id._id', roles: 1}}
            ];
            let data = await ctx.model.User.aggregate(pipes);
            return data && data.length ? data[0] : {};

        }

        //register user
        async createNewUser(data) {
            const {ctx} = this;
            let account = new Account(ctx.model.User);
            const defaultPwd = '123456';
            ctx.validate({
                name: {type: 'string', required: true},
                username: {type: 'string', required: true},
                mobile: {type: 'string', required: true},
                role: {type: 'string', required: true},
                status: {type: 'string', required: true}
            }, data);
            data.num = 'C0' + await ctx.generatorId('user');
            if (data.password) {
                ctx.validate({
                        digest: {type: 'string', required: true},
                        algorithm: {type: 'string', required: false}
                    },
                    data.password);
                let algorithm = data.password.algorithm || 'sha-256';
                data.password.algorithm = algorithm;
            } else {
                data.password = {
                    algorithm: 'sha-256',
                    digest: account._getPasswordString(defaultPwd)
                };
            }
            data.firstLogin = true;
            let res;
            try {
                res = await account.createUser(data);
            } catch (error) {
                if (error.code === 11000 && error.name === 'MongoError')
                    throw new ctx.error.AuthCheckErr.RegisterErr('username-exists', null, 'username exists');
                throw new ctx.error.AuthCheckErr.RegisterErr('register-failed', null, 'register failed');
            }
            await ctx.addOpLog('users', 'insert', '', res);
            return {userId: res._id, defaultPwd};
        }

        //check Token expired
        async resume(token) {
            const {ctx} = this;
            const account = new Account(ctx.model.User);
            let res;
            try {
                res = await account.loginWithToken({resume: token});
            } catch (e) {
                ctx.clearTokenCookies();
                if (e.message === 'Token expired') {
                    throw new ctx.error.AuthCheckErr.LoginErr('token-expired', null, 'Your session has expired. Please log in again.');
                } else {
                    throw new ctx.error.AuthCheckErr.LoginErr('not-logged-in', null);
                }
            }
            if (!res) {
                ctx.clearTokenCookies();
                throw new ctx.error.AuthCheckErr.LoginErr('token-expired', null, 'Your session has expired. Please log in again.');
            }
            return res;
        }

        //login with password
        async loginWithPassword(data) {
            const {ctx} = this;
            ctx.validate({
                username: {type: 'string', required: true},
                password: {type: 'object', required: true}
            }, data);

            ctx.validate({
                algorithm: {type: 'string', required: false},
                digest: {type: 'string', required: true}
            }, data.password);


            data.password.algorithm = data.password.algorithm || 'sha-256';
            let account = new Account(ctx.model.User, {loginExpirationInDays: app.config.account.LOGIN_EXPIRATION_DAYS});
            let res;
            try {
                res = await account.loginWithPassword(data);
            } catch (e) {
                if (e.message === 'User not found') {
                    throw new ctx.error.AuthCheckErr.LoginErr('not-registered', null, "You've been not register. Please register again.")
                } else if (e.message === 'Incorrect password') {
                    throw new ctx.error.AuthCheckErr.LoginErr('password-error', null, "Incorrect password");
                } else {
                    throw new ctx.error.AuthCheckErr.LoginErr('login-failed', null, "login failed");
                }
            }
            if (!res || !res.id) {
                throw new ctx.error.AuthCheckErr.LoginErr('login-failed', null, "login failed");
            }
            let user = await this.getUserById(res.id, {services: 0});

            //check user status
            if (user.status !== 'normal') {
                await this.updateUserById(user._id, {$unset: {'services.resume.loginTokens': 1}});
                throw new ctx.error.AuthCheckErr.LoginErr('status-error', null, "status-error");
            }
            if (!user.firstLogin) {
                let roles = await this.loadUserRoles(user._id);
                _.assign(user, roles);
            }
            ctx.setTokenCookies(res.token, res.tokenExpires);
            await ctx.addOpLog('users', 'login', '', `${user.name || user.username} login with password`);
            return _.assign(user, {tokenExpires: res.tokenExpires});
        }

        //reset password

        async resetPassword(data) {
            const {ctx} = this;
            ctx.validate({
                password: {type: 'object', required: true}
            }, data);

            ctx.validate({
                algorithm: {type: 'string', required: false},
                digest: {type: 'string', required: true}
            }, data.password);
            data.password.algorithm = data.password.algorithm || 'sha-256';

            let account = new Account(ctx.model.User, {loginExpirationInDays: app.config.account.LOGIN_EXPIRATION_DAYS});
            let oldpwd = account._getPasswordString('123456');

            if (data.password.digest === oldpwd) {
                throw new ctx.error.AuthCheckErr.AccountsErr('old-password-format', null, 'old password format')
            }
            let res;
            try {
                res = await account.resetPassword(ctx.token, data.password);
            } catch (e) {
                if (e.message === 'Token expired') {
                    throw new ctx.error.AuthCheckErr.LoginErr('token-expired', null, 'Your session has expired. Please log in again.');
                } else {
                    throw new ctx.error.AuthCheckErr.AccountsErr('not-logged-in', null);
                }
            }
            if (!res || !res.userId) {
                throw new ctx.error.BusinessErr(null, '更改密码出错请稍后再试.', 'update password error');
            }
            //clear old cookies
            ctx.clearTokenCookies();
            //update login satus
            await this.updateUserById(res.userId, {$unset: {firstLogin: 1}});
            return res;
        }

        //query user by id return a object
        async getUserById(id, fields = {}) {
            const {ctx} = this;
            if (!id) {
                return null
            }

            let user = await ctx.model.User.findById(id, fields);
            return app.formatData(user);
        }

        //query user list by condition return Array
        async userList(condition, {page, pageSize, sort}) {
            const {ctx} = this;
            let option = ctx.helper.pageOption(page, pageSize, {sort}, true);
            let query = _.pick(condition, ['num', 'name', 'status', 'mobile']);
            let pipes = [
                {$match: query},
                ...option,
                {$lookup: {from: 'roles', localField: 'role', foreignField: '_id', as: 'roles'}},
                {$unwind: {path: '$roles', preserveNullAndEmptyArrays: true}},
                {$project: {_id: 1, roles: '$roles.roles', roleName: '$roles.name'}},
                {$unwind: {path: '$roles', preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'roles.menus', localField: 'roles', foreignField: '_id', as: 'roles_menus'}},
                {$unwind: {path: '$roles_menus', preserveNullAndEmptyArrays: true}},
                {
                    $group: {
                        _id: {_id: '$_id', roleName: '$roleName'},
                        roles: {$addToSet: '$roles_menus.name'}
                    }
                },
                {
                    $project: {
                        _id: '$_id._id',
                        roleName: '$_id.roleName',
                        isAdmin: {$size: {$filter: {input: "$roles", as: 'role', cond: {$eq: ["$$role", 'admin']}}}}
                    }
                },
                {$lookup: {from: 'users', localField: '_id', foreignField: '_id', as: 'user'}},
                {
                    $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$user", 0]}, "$$ROOT"]}}
                },
                {$project: {user: 0, services: 0, __v: 0}},
                option[0]

            ];
            let list = await ctx.model.User.aggregate(pipes);
            let total = await ctx.model.User.countDocuments(condition);
            return {list, total};
        }

        //update user by id
        async updateUserById(_id, modifier) {
            const {ctx} = this;
            if (!modifier || _.isEmpty(modifier)) {
                throw new ctx.error.BusinessErr(null, '更新数据失败，数据未发生改变', 'update exchange error, data no change')
            }
            let {nModified} = await ctx.model.User.updateOne({_id}, modifier);
            await ctx.addOpLog('users', 'update', {_id}, modifier);
            return !!nModified;
        }

        //update user status
        async updateUserStatus(data) {
            const {ctx} = this;
            ctx.validate({
                ids: {
                    type: 'array',
                    itemType: 'string',
                    required: true
                },
                status: ['disable', 'normal']
            }, data);
            if (!data.ids || !data.ids.length) {
                throw new ctx.error.BusinessErr(null, 'Params error, filed `ids` length must be greater than 0')
            }

            let modifier = {
                $set: {status: data.status}
            };
            if (data.status === 'disable') {
                modifier.$unset = {'services.resume.loginTokens': 1};
            }
            let {nModified} = await ctx.model.User.updateMany({_id: {$in: data.ids}}, modifier);
            await ctx.addOpLog('users', 'update', {_id: {$in: data.ids}}, modifier);
            return nModified;
        }

        //login out
        async loginOut(userId) {
            const {ctx} = this;
            if (ctx._userId !== userId) {
                throw new ctx.error.BusinessErr(null, 'user error')
            }
            let upd = await this.updateUserById(userId, {$unset: {'services.resume.loginTokens': 1}});
            if (upd) {
                ctx.clearTokenCookies();
            }
            return upd;
        }

        async getUserEditInfo(_id) {
            const {ctx} = this;
            let result = {};
            //return user info
            if (!_id || _id === 'new') {
                result.user = {}
            } else {
                result.user = await this.getUserById(_id, {
                    _id: 1,
                    num: 1,
                    name: 1,
                    username: 1,
                    mobile: 1,
                    status: 1,
                    role: 1,
                    exchange: 1
                });
            }

            let roleCond = {};
            let roleAuth = await ctx.userRoleAuth('admin', 'admin');
            if (!roleAuth) {
                let admin = await ctx.model.RoleMenus.findOne({name: 'admin', group: {$exists: 1}}, {_id: 1});
                roleCond = {roles: {$ne: admin._id}};
            }
            result.roles = await ctx.model.Role.find(roleCond, {_id: 1, name: 1, link_exchange: 1});
            return result;
        }

        async initializePassword(userId) {
            const {ctx} = this;
            ctx.validate({
                userId: {type: 'string', required: true}
            }, {userId});
            let roleAuth = await ctx.userRoleAuth('initializePassword', 'settings');
            if (!roleAuth) {
                throw new ctx.error.BusinessErr(null, '无权执行此操作.', 'No access permission');
            }

            let account = new Account(ctx.model.User, {loginExpirationInDays: app.config.account.LOGIN_EXPIRATION_DAYS});
            let defaultPwd = random.generate({length: 6, charset: '0123456789'});
            let password = {
                algorithm: 'sha-256',
                digest: account._getPasswordString(defaultPwd)
            };

            let res;
            try {
                res = await account.setPassword(userId, password);
            } catch (e) {
                if (e.message === 'User not found') {
                    throw new ctx.error.BusinessErr(null, '未找到指定用户.', 'User not found');
                }

                throw new ctx.error.BusinessErr(null, '初始化密码出错.', 'init password error' + e.message);
            }
            if (!res || !res.userId) {
                throw new ctx.error.BusinessErr(null, '初始化密码失败.', 'init password error');
            }
            await ctx.addOpLog('users', 'update', res, `初始化密码`);
            return {defaultPwd};

        }
    }

    return UserService;
};