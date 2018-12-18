const _ = require('lodash');
var fs = require("fs");
const path = require("path");

let printUrl = (app) => {
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

    // let urls = _.sortBy(app.router.stack, 'rul');
    // urls.forEach((route) => {
    //     let m = _.last(route.methods);
    //     console.log('  * #### `' + route.path + '`');
    //     console.log('    * Method：```' + m + '```');
    //     console.log('    * Headers：```{Content-Type: application/json, Authorization: String}```');
    //
    //
    //     if (m === 'GET') {
    //         if(route.path.indexOf(':id')<0){
    //             console.log('    * QueryParams：```condition={}&option={"page":1,"pageSize":15,"sort":{"createdAt":-1}}```');
    //         }
    //         console.log('    * Response');
    //         console.log('    ```bash');
    //         console.log('       {');
    //         console.log('           count: Number,');
    //         console.log('           page: Number,');
    //         console.log('           total: Number,');
    //         console.log('           list: [Object]');
    //         console.log('       }');
    //         console.log('    ```');
    //     }
    //
    //     if (m === 'POST') {
    //         console.log('    * Post data：```{}```');
    //         console.log('    * Response');
    //         console.log('    ```bash');
    //         console.log('       {');
    //         console.log('           data: {}');
    //         console.log('       }');
    //         console.log('    ```');
    //     }
    //
    //     if (m === 'PUT') {
    //         console.log('    * Post data：```{}```');
    //         console.log('    * Response');
    //         console.log('    ```bash');
    //         console.log('       {');
    //         console.log('           data: {}');
    //         console.log('       }');
    //         console.log('    ```');
    //     }
    //
    //     if (m === 'DELETE') {
    //         console.log('    * Response');
    //         console.log('    ```bash');
    //         console.log('       {');
    //         console.log('           data: {}');
    //         console.log('       }');
    //         console.log('    ```');
    //     }
    //
    //
    //
    //     // console.log(m, route.path);
    //
    // });
    console.log('..............................................');

};

let readController = (path, filesList) => {
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
                    root: conPath[0],
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
    registerRouter: (app, noAuthCheck) => {
        let filesList = [], controllerPath = path.join(app.baseDir, '/app/controller');
        readController(controllerPath, filesList);
        // console.log(filesList);
        filesList = filesList.sort((a, b) => b.length - a.length);

        filesList.forEach(({name, path, controller}) => {
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
