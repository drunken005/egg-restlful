const _ = require('lodash');

module.exports = app => {
    class RoleService extends app.Service {

        async createRole(data) {
            const {ctx} = this;
            ctx.validate({
                name: {type: 'string'},
                desc: {type: 'string'},
                link_exchange: {type: 'string'}
            }, data);
            data = _.assign({
                _id: 'R0' + await ctx.generatorId('role')
            }, data);
            console.log(data);
            let role = await ctx.model.Role.create(data);
            console.log(role);
            return role;
        }

        async roleList(condition, {page, pageSize, sort}) {
            const {ctx} = this;
            let option = ctx.helper.pageOption(page, pageSize, {sort}, true);
            let query = _.pick(condition, ['num', 'name', 'status', 'mobile']);
            let pipes = [
                {$match: query},
                ...option,
                {$unwind: {path: '$roles', preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'roles.menus', localField: 'roles', foreignField: '_id', as: 'roles_menus'}},
                {$unwind: {path: '$roles_menus', preserveNullAndEmptyArrays: true}},
                {
                    $group: {
                        _id: '$_id',
                        roles: {$addToSet: '$roles_menus.name'}
                    }
                },
                {
                    $project: {
                        isAdmin: {
                            $size: {
                                $filter: {
                                    input: "$roles",
                                    as: 'role',
                                    cond: {$eq: ["$$role", 'admin']}
                                }
                            }
                        }
                    }
                },
                {$lookup: {from: 'roles', localField: '_id', foreignField: '_id', as: 'roles'}},
                {
                    $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$roles", 0]}, "$$ROOT"]}}
                },
                {$project: {roles: 0, __v: 0}},
                option[0]
            ];

            let list = await ctx.model.Role.aggregate(pipes);
            let total = await ctx.model.Role.countDocuments(condition);
            return {list, total};
        }

        async getRoleById(id, fields = {}) {
            const {ctx} = this;
            if (!id) {
                return null
            }
            return ctx.model.Role.findById(id, fields);
        }

        async updateRoleById(_id, modifier) {
            const {ctx} = this;
            if (!modifier || _.isEmpty(modifier)) {
                throw new ctx.error.BusinessErr(null, '更新数据失败，数据未发生改变', 'update exchange error, data no change')
            }
            let {nModified} = await ctx.model.Role.updateOne({_id}, modifier);
            return !!nModified;
        }

        async getRoleMenusMatch(id) {
            const {ctx} = this;
            let role = app.formatData(await this.getRoleById(id, {_id: 1, name: 1, roles: 1}));

            let cond = {};

            let roleAuth = await ctx.userRoleAuth('admin', 'admin');
            if (!roleAuth) {
                cond = {name: {$ne: 'admin'}};
            }

            let role_menu_pipes = [
                {$match: cond},
                {
                    $lookup:
                        {
                            from: "roles.menus",
                            let: {roles_item: "$_id"},
                            pipeline: [
                                {
                                    $match:
                                        {
                                            $expr:
                                                {$eq: ["$group", "$$roles_item"]}
                                        }
                                },
                                {$project: {value: '$_id', name: 1, label: '$desc'}},
                                {$sort: {_id: 1}}
                            ],
                            as: "sub_menus"
                        }
                },
                {$match: {root: true}},
                {$sort: {_id: 1}},
                {$project: {_id: 1, name: 1, desc: 1, sub_menus: 1}},
            ];
            let menus = await ctx.model.RoleMenus.aggregate(role_menu_pipes);
            role.menus = menus;
            return role;
        }
    }

    return RoleService;
};