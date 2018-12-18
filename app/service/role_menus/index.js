const _ = require('lodash');

module.exports = app => {
    class RoleMenusService extends app.Service {

        async createRoleMenus(data) {
            const {ctx} = this;
            ctx.validate({
                name: {type: 'string'},
                desc: {type: 'string'},
                group: {type: 'string'}
            }, data);

            let groupExists = await ctx.model.RoleMenus.countDocuments({_id: data.group, root: true});
            if (!groupExists) {
                throw new ctx.error.BusinessErr(null, `权限组 ${data.group} 不存在`, 'Role group not exists')
            }

            let exists = await ctx.model.RoleMenus.countDocuments({
                group: data.group,
                $or: [{name: data.name}, {desc: data.desc}]
            });
            if (exists) {
                throw new ctx.error.BusinessErr(null, '系统已经存在相同的权限标识或权限名称,请检查', 'Role name and desc exists')
            }
            let count = await ctx.model.RoleMenus.countDocuments({group: data.group});
            data = _.assign({
                _id: [data.group, count > 10 ? count : '0' + count].join('-'),
                createdAt: new Date()
            }, _.pick(data, ['name', 'desc', 'group']));
            let role = await ctx.model.RoleMenus.create(data);
            return role;
        }

        async initRoleMenus() {
            const {ctx} = this;
            const CXP_MENUS = [
                {
                    icon: 'interation',
                    name: '交易所管理',
                    role: 'exchange',
                    children: [
                        {
                            name: '交易所列表',
                            route: 'exchange/info',
                            role: 'list'
                        },
                        {
                            name: '交易对管理',
                            route: 'exchange/pairs',
                            role: 'pairs'
                        }
                    ]
                },
                {
                    icon: 'dollar',
                    name: '交易管理',
                    role: 'trade',
                    children: [
                        {
                            name: '币种管理',
                            route: 'trade/currencies',
                            role: 'currencies',
                        },

                        {
                            name: '交易对管理',
                            route: 'trade/pairs',
                            role: 'pairs',
                        }

                    ]
                },
                {
                    icon: 'team',
                    name: '用户管理',
                    role: 'users',
                    children: [
                        {
                            name: '用户列表',
                            route: 'user/userinfo',
                            role: 'list'
                        }
                    ]
                },

                {
                    icon: 'setting',
                    name: '系统设置',
                    role: 'settings',
                    children: [
                        {
                            name: '账号管理',
                            route: 'settings/account',
                            role: 'account'
                        },
                        {
                            name: '角色&权限',
                            route: 'settings/role',
                            role: 'role'
                        },
                        {
                            name: '操作日志',
                            route: 'settings',
                            role: 'logs'
                        }
                    ]
                }
            ];
            let roles = [];
            for (let menu of CXP_MENUS) {
                let _id = 'M' + await ctx.generatorId('menus');
                roles.push({
                    _id,
                    name: menu.role,
                    desc: menu.name,
                    root: true
                });
                if (menu.children && menu.children.length) {
                    _.each(menu.children, (doc, index) => {
                        roles.push({
                            _id: [_id, index > 10 ? index : '0' + index].join('-'),
                            name: doc.role,
                            desc: doc.name,
                            group: _id
                        });
                    })
                }
            }
            let result = await ctx.model.RoleMenus.create(roles);
            return result;
        }

        async roleMenusList(condition, {page, pageSize, sort}) {
            const {ctx} = this;
            let option = ctx.helper.pageOption(page, pageSize, {sort});
            let query = _.pick(condition, ['root', 'group']);
            let list = await ctx.model.RoleMenus.find(query, {services: 0}, option);
            let total = await ctx.model.RoleMenus.countDocuments(condition);
            return {list, total};
        }

        async getRoleMenuById(id, fields = {}) {
            const {ctx} = this;
            if (!id) {
                return null
            }
            return ctx.model.RoleMenus.findById(id, fields);
        }

        async updateRoleMenuById(_id, modifier) {
            const {ctx} = this;
            if (!modifier || _.isEmpty(modifier)) {
                throw new ctx.error.BusinessErr(null, '更新数据失败，数据未发生改变', 'update exchange error, data no change')
            }
            let {nModified} = await ctx.model.RoleMenus.updateOne({_id}, modifier);
            return !!nModified;
        }

        async removeRoleMenuById(id) {
            const {ctx} = this;
            ctx.validate({
                id: {type: 'string'}
            }, {id});
            let isRoot = await ctx.model.RoleMenus.countDocuments({_id: id, root: true});
            if (isRoot) {
                throw new ctx.error.BusinessErr(null, '删除权限失败,权限组不允许删除操作.', 'Can not remove role menu group.')
            }

            let roleExists = await await ctx.model.Role.countDocuments({roles: id});
            if (roleExists) {
                throw new ctx.error.BusinessErr(null, '该权限已配置到角色,请从角色权限里面解除关系后再删除.', 'Role exists current menu')
            }

            let remove = await ctx.model.RoleMenus.deleteOne({_id: id});
            return !!remove.n;

        }
    }

    return RoleMenusService;
};