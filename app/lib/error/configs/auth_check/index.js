const LoginErr = require('./login');
const RegisterErr = require('./register');
const VerificationCodeErr = require('./verification_code');
const AccountsErr = require('./accounts');
const SignErr = require('./sign');

let messages = [];

module.exports = {
    messages,
    children: {
        LoginErr, // 10100
        RegisterErr, // 10200
        VerificationCodeErr, // 10300
        AccountsErr, // 10400
        SignErr // 10500
    }
};