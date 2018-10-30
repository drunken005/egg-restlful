const _ = require('lodash');
var fs = require("fs");
const path = require("path");

let printUrl = (app)=> {
    console.log('.............................................');
    var urls = app.router.stack.map((route)=> {
        let m = _.last(route.methods), method;
        if (_.includes(['GET', 'PUT'], m)) {
            method = '   ' + m;
        } else if (m === 'POST') {
            method = '  ' + m;
        } else {
            method = m;
        }
        return {method, rul: route.path};
    });
    urls = _.sortBy(urls, 'rul').map(route=>[route.method, route.rul].join(' - '));
    console.log(urls.map(route => `[ ${route} ]`).join('\n'));
    console.log('.............................................');

};

let readController = (path, filesList)=> {
    let files = fs.readdirSync(path);
    files.forEach(walk);
    function walk(file) {
        let states = fs.statSync(path + '/' + file);
        if (states.isDirectory()) {
            readController(path + '/' + file, filesList);
        }
        else {
            let dir = path + '/' + file;
            let controller = dir.split('controller/')[1];
            controller = controller.split('.')[0].replace(/[/]/g, '.');
            let conPath = _.initial(controller.split('.'));

            filesList.push(
                {
                    name: conPath.join('.'),
                    path: conPath.join('/'),
                    controller,
                    length: conPath.length
                }
            );
        }
    }
};

module.exports = {
    registerRouter: (app, noAuthCheck)=> {
        let filesList = [], controllerPath = path.join(app.baseDir, '/app/controller');
        readController(controllerPath, filesList);
        filesList = filesList.sort((a, b)=>b.length - a.length);
        filesList.forEach(({name, path, controller})=> {
            if (_.includes(noAuthCheck, name)) {
                app.resources(name, app.config.noAuthCheck + path, controller)
            } else {
                app.resources(name, app.config.authCheck + path, controller)
            }
        });
        app.redirect('/app', '/app/home', 302);
        // !app.isProduction() && printUrl(app);
        printUrl(app)
    }
};
