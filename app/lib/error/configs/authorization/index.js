const AuthKeyErr = require('./auth_key');
let messages = [];

module.exports = {
    messages,
    children: {
        AuthKeyErr
    }
};