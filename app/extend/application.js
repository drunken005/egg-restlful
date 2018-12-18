require('../lib/extension');

const random = require('randomstring');
const _ = require('lodash');

module.exports = {
    randomId(num = 17) {
        return random.generate(num);
    },
    isProduction() {
        console.log(this.config.env);
        return this.config.env === 'prod';
    },

    //format Response data
    formatData(data) {
        if (_.isString(data) || _.isNumber(data) || _.isFunction(data) || _.isBoolean(data)) {
            return data;
        }

        if (_.isDate(data)) {
            return new Date(data).format('yyyy-MM-dd hh:mm:ss');
        }

        if (_.isArray(data)) {
            data = _.map(data, (doc) => {
                return this.formatData(doc);
            });
            return data;
        }
        if (_.isObject(data)) {
            if (!_.isEmpty(data) && data.hasOwnProperty('$__') && data.hasOwnProperty('errors') && data.hasOwnProperty('_doc') && data.hasOwnProperty('$init')) {
                data = data.toObject();
            }
            _.each(data, (v, k) => {
                data[k] = this.formatData(data[k]);
            });
            data = _.omit(data, ['__v']);
        }
        return data;
    }
};
