const error = require('./error');
const apis = require('./apis');
let isDoraError = (e) => error.isDoraErrorInstance(e);
let isValidateError = (e)=> e.message === 'Validation Failed' && e.error !== 500;

module.exports = {
    error,
    apis,
    isDoraError,
    isValidateError
};