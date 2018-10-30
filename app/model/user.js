module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        _id: {type: String},
        createdAt: {type: Date},
        services: {
            password: {bcrypt: {type: String}},
            resume: {
                loginTokens: {
                    type: [
                        {
                            when: Date,
                            hashedToken: String
                        }
                    ]
                }
            }
        },
        username: {type: String},
        mobile: {type: String},
        loginAt: {type: Date},
        realName: {type: String}
    });

    return mongoose.model('User', UserSchema);
};
