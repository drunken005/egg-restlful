module.exports = app => {
    const mongoose = app.mongoose;

    const schema = new mongoose.Schema({
        _id: String,
        generator: {
            _id: Number
        }
    });
    return mongoose.model('UniqueCode', schema);
};