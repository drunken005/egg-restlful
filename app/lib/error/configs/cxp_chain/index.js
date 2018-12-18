const AuthorizationError = require('./authorization');

let messages = [];

module.exports = {
    messages,
    children: {
        AuthorizationError //70100
    }
};