module.exports = app => {
    class RoleController extends app.Controller {
        async index() {
            const {ctx} = this;
            let {condition, option} = ctx.formatQueryParams();
            ctx.validate({
                page: {type: 'number', required: true},
                pageSize: {type: 'number', required: true}
            }, option);
            let {list, total} = await ctx.service.role.index.roleList(condition, option);
            this.success({
                count: list.length,
                page: option.page,
                total,
                list
            });
        }

        async show(){
            const {ctx} = this;
            const {id} = ctx.params;
            let data = await ctx.service.role.index.getRoleMenusMatch(id);
            this.success(data);

        }

        async create(){
            const {ctx} = this;
            let data = ctx.request.body;
            ctx.validate({
                name: {type: 'string'},
                desc: {type: 'string'},
                link_exchange: {type: 'string'}
            }, data);
            let res = await ctx.service.role.index.createRole(data);
            this.success(res);
        }

        async edit() {
            const {ctx} = this;
            const {id} = ctx.params;
            let data = await ctx.service.role.index.getRoleById(id);
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
            let data = await ctx.service.role.index.updateRoleById(id, modifier);
            this.success(data);
        }

    }

    return RoleController;
};