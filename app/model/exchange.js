module.exports = app => {
    const mongoose = app.mongoose;

    const schema = new mongoose.Schema({
        _id: {type: String},
        name: {type: String},
        short_name: {type: String},
        logo: {type: String},
        address: {type: String},
        contact_name: {type: String},
        contact_mobile: {type: String},
        website: {type: String},
        account: {type: String},
        createdAt: {type: Date},
        status: {type: String, defaultValue: 'normal'}
    });

    return mongoose.model('Exchange', schema);
};
