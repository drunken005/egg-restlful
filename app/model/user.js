module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        _id: {type: String},
        num: {type: String},
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
        name: {type: String},
        username: {type: String},
        mobile: {type: String},
        role: {type: String},
        exchange: {type: String},
        status: {type: String},
        realName: {type: String},
        firstLogin: {type: Boolean},
        createdAt: {type: Date}

    });

    return mongoose.model('User', UserSchema, 'users');
};
