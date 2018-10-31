Date.setterMap = {
    y: 'setFullYear',
    M: 'setMonth',
    d: 'setDate',
    h: 'setHours',
    m: 'setMinutes',
    s: 'setSeconds',
    S: 'setMilliseconds'
};

Date.getterMap = {
    y: 'getFullYear',
    M: 'getMonth',
    d: 'getDate',
    h: 'getHours',
    m: 'getMinutes',
    s: 'getSeconds',
    S: 'getMilliseconds'
};

/**
 * 处理了未定义异常，并且附带日期解析功能的的日期格式化方法
 * @param date {?Date|number|string}
 * @param fmt {string}
 * @returns {string}
 */
Date.format = function (date, fmt) {
    date = Date.parseDate(date);
    if (!(date instanceof Date)) {
        return '';
    }
    return date.format(fmt);
};

/**
 * 尝试将一个对象或数值解析为日期对象
 * @param date 必须为数值/日期对象/可被Date.parse解析的字符串
 * @returns Date|null|undefined，如果传入一个日期对象，则返回该对象的拷贝
 */
Date.parseDate = function (date) {
    if (date == null) {
        return date;
    }
    if (date instanceof Date) {
        return new Date(date);
    }

    if (!isNaN(date) && !isFinite(date)) {
        return new Date(date);
    }

    var val = Date.parse(date);
    if (!isNaN(val)) {
        return new Date(val);
    }

    val = parseInt(date);
    if (!isNaN(val)) {
        return new Date(val);
    }
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                                         (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

/**
 * 将日期对象分解为一个简单对象，该对象包含：
 * {
 *     y: 四位年
 *     yy: 两位年
 *     M： 月份
 *     d: 当月中的日期
 *     h: 一天中的小时
 *     m: 分钟
 *     s: 秒
 *     S: 毫秒
 * }
 * @param inHabit 是否按照习惯获得月份字段，默认为true
 */
Date.prototype.breakInJSON = function (inHabit) {
    inHabit = (inHabit !== false);
    if (isNaN(this.getTime())) {
        return null;
    }
    var fmt = 'yyyy-M-d-h-m-s-S';
    var fmtPtns = fmt.split('-');
    var patterns = this.format(fmt).split('-');
    var y = patterns[0];
    var yy = y.substring(y.length - 2);
    var res = {y: parseInt(y), yy: parseInt(yy)};
    for (var i = 1; i < fmtPtns.length; i++) {
        res[fmtPtns[i]] = parseInt(patterns[i]);
    }
    res.M = res.M - !inHabit;

    return res;
};

/**
 * 利用传入的简单对象和模板日期对象重建日期对象
 * @param options
 * @param tempDate 作为模板的日期对象，如果无法从options中查询到某个字段时，将从该模板中获取，默认为当日的00:00:00.000
 */
Date.buildFromJSON = function (options, tempDate) {
    if (!options) {
        throw 'options can not be empty';
    }
    var patterns = 'y-M-d-h-m-s-S'.split('-');
    if (!tempDate || !isNaN(tempDate.getTime())) {
        tempDate = new Date();
        tempDate.setHours(0);
        tempDate.setMinutes(0);
        tempDate.setSeconds(0);
        tempDate.setMilliseconds(0);
    }

    var date = Date.parseDate(tempDate);
    for (var i = 0; i < patterns.length; i++) {
        var field = patterns[i];
        var val = options[field];
        date[Date.setterMap[field]](val == null ? tempDate[Date.getterMap[field]] : val);
    }
    return date;
};

/**
 * 通过对指定字段指定一个整数来对日期的指定字段进行增减操作
 * @param options
 */
Date.prototype.calculator = function (options) {
    var date = Date.parseDate(this);
    if (!options) {
        return date;
    }

    for (var i in options) {
        var setter = Date.setterMap[i];
        var getter = Date.getterMap[i];
        var num = parseInt(options[i]);
        if (setter && getter && !isNaN(num)) {
            date[setter](date[getter]() + num);
        }
    }
    return date;
};
Date.prototype.subtract = function (options) {
    var date = Date.parseDate(this);
    if (!options) {
        return date;
    }

    for (var i in options) {
        var setter = Date.setterMap[i];
        var getter = Date.getterMap[i];
        var num = parseInt(options[i]);
        if (setter && getter && !isNaN(num)) {
            date[setter](date[getter]() - num);
        }
    }
    return date;
};

String.prototype.pad = function(len, char, way) {
    if (!char) {
        char = ' ';
    } else if (char === '') {
        throw 'char can not be empty string';
    }
    if (!way) {
        if ('lrLR'.indexOf(char) >= 0) {
            way = char;
            char = ' ';
        } else {
            way = 'l';
        }
    }
    if ('lrLR'.indexOf(way) < 0) {
        throw 'pad way should be empty or in l,r,L or R';
    }

    way = way.toLowerCase();
    let val = this,
        str = '';
    for (let i = 0; i < len - val.length; i++) {
        str += char;
    }
    return way === 'l' ? (str + val) : (val + str);
};