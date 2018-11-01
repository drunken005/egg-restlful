require('../lib/extension');

const random = require('randomstring');
const _ = require('lodash');

module.exports = {
    randomId (num = 17) {
        return random.generate(num);
    },
    isProduction(){
        console.log(this.config.env);
        return this.config.env === 'prod';
    },
    formatData(data){
        if (!data) {
            return;
        }
        if (_.isArray(data)) {
            return data;
        }
        return _.omit(data.toObject(), ['__v']);
    }
};
