'use strict';

// had enabled by egg
// exports.static = true;

exports.security = {
    enable: process.env.EGG_SERVER_ENV === 'prod',
};

exports.validate = {
    enable: true,
    package: 'egg-validate',
};

exports.mongoose = {
    enable: true,
    package: 'egg-mongoose'
};

exports.cors = {
    enable: true,
    package: 'egg-cors',
    allowMethods: 'GET,POST,PUT,DELETE'
};