const CryptoJS = require('crypto-js');
const _ = require('lodash');

module.exports = {
    encrypt(data, secret) {
        if (!secret) {
            throw new Error('Encrypt data secret is null');
        }
        if (_.isObject(data)) {
            data = JSON.stringify(data)
        }
        return CryptoJS.AES.encrypt(data, secret).toString();
    },

    decrypt(data, secret) {
        if (!secret) {
            throw new Error('Decrypt data secret is null');
        }
        return CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8)
    }
};