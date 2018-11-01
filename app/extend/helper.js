const _ = require('lodash');

module.exports = {

    pageOption(page, pageSize, options, isAggregation) {
        page = parseInt(page);
        pageSize = parseInt(pageSize);

        this.ctx.validate({
            page: {type: 'number', required: true},
            pageSize: {type: 'number', required: true},
        }, {page, pageSize});

        if (_.isBoolean(options)) {
            isAggregation = options;
            options = {};
        }

        let skip = (page - 1) * pageSize;
        let limit = pageSize;

        if (isAggregation) {
            limit = page * pageSize;
            let result = [];
            if (options.sort) {
                result.push({$sort: options.sort})
            }
            return result.concat([{$limit: limit}, {$skip: skip}]);
        }
        return _.assign({skip, limit}, options);
    }

};