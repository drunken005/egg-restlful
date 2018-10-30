const FileErr = require('./file');

let messages = [
    {
        index: 0,
        name: 'uncaught-error',
        message (e) {
            e && debugConsole.error('uncaught-error:', e.stack || e);
            return `系统异常`;
        }
    },
    {
        index: 1,
        name: 'closed',
        message: '该接口暂不开放'
    },
    {
        index: 2,
        name: 'too-many-requests',
        message: '您请求得太频繁了，请稍微歇一歇吧！'
    },
    {
        index: 3,
        name: 'prompt-update',
        message: '亲，您当前的应用版本需要更新哦。'
    },
    {
        index: 4,
        name: 'force-update',
        message: '亲，您当前的版本太旧了。'
    },
    {
        index: 5,
        name: 'error-version-format',
        message: '错误的版本号格式'
    },
    {
        index: 6,
        name: 'repair-update',
        message: '当前有新的可用更新。'
    },
    {
        index: 7,
        name: 'not-implemented',
        message: '该功能尚未实现。'
    }
];

module.exports= {
    messages,
    children: {
        FileErr // 50100
    }
};