module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        _id: {type: String},
        name: {type: String},
        desc: {type: String},
        root: {type: Boolean},
        group: {type: String},
        createdAt: {type: Date}
    });

    return mongoose.model('RoleMenus', schema, 'roles.menus');
};
