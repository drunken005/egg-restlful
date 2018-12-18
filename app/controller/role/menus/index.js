module.exports = app => {
    class RoleMenus extends app.Controller {
        async index() {
            const {ctx} = this;
            let {condition, option} = ctx.formatQueryParams();
            ctx.validate({
                page: {type: 'number', required: true},
                pageSize: {type: 'number', required: true}
            }, option);
            let {list, total} = await ctx.service.roleMenus.index.roleMenusList(condition, option);
            this.success({
                count: list.length,
                page: option.page,
                total,
                list,
            });
        }

        async create() {
            const {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                name: {type: 'string'},
                desc: {type: 'string'},
                group: {type: 'string'}
            }, data);
            let res = await ctx.service.roleMenus.index.createRoleMenus(data);
            this.success(res);
        }

        async edit() {
            const {ctx} = this;
            const {id} = ctx.params;
            let data = await ctx.service.roleMenus.index.getRoleMenuById(id, {services: 0});
            this.success(data);
        }

        async update() {
            const {ctx} = this;
            let body = ctx.request.body;
            let {id} = ctx.params;
            ctx.validate({
                modifier: {type: 'object', required: true}
            }, body);
            let {modifier} = body;
            let data = await ctx.service.roleMenus.index.updateRoleMenuById(id, modifier);
            this.success(data);
        }

        async destroy() {
            const {ctx} = this;
            const {id} = ctx.params;
            ctx.validate({
                id: {type: 'string'}
            }, {id});
            let data = await ctx.service.roleMenus.index.removeRoleMenuById(id);
            this.success(data);
        }
    }

    return RoleMenus;
};