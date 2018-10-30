const configs = require('./configs');
const DoraError = require('dora-error');

let errors = DoraError.factory(configs);
errors.isDoraErrorInstance = DoraError.ErrClass.isDoraErrorInstance;
module.exports = errors;