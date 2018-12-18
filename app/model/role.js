module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        _id: {type: String},
        name: {type: String},
        desc: {type: String},
        link_exchange: {type: String},
        roles: [Object]
    });

    return mongoose.model('Role', schema);
};
