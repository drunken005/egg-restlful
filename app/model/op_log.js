module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        _id: {type: String},
        coll: {type: String},
        action: {type: String},
        condition: {type: String},
        data: {type: String},
        method: {type: String},
        path: {type: String},
        ipAddress: {type: String},
        handler: {
            _id: {type: String},
            name: {type: String}
        },
        createdAt: {type: Date}
    });

    return mongoose.model('OpLog', schema, 'op_logs');
};
