const _ = require('lodash');
const AuthCheckErr = require('./auth_check');
const BusinessErr = require('./business');
const NetWorkErr = require('./net_work');
const ParamsErr = require('./params');
const SystemErr = require('./system');
const AuthorizationErr = require('./authorization');
const CxpChainErr = require('./cxp_chain');

let Errors = {
    AuthCheckErr, // 10000
    BusinessErr, // 20000
    NetWorkErr, // 20000
    ParamsErr, // 40000
    SystemErr, // 50000
    AuthorizationErr, // 60000
    CxpChainErr // 70000
};
module.exports = Errors;