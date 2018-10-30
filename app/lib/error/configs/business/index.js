const SmsErr = require('./sms');
let messages = [];

module.exports = {
    messages,
    children: {
        SmsErr //20100
    }
};