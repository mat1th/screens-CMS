// replace this file with your own content as filename config.js
var env = process.env.NODE_ENV || 'development',
    core = require('./config.json');

var merge = function(target, source) {
    // console.log(source);
    for (var k in source) {
        if (typeof target[k] === 'object' && typeof source[k] === 'object') {
            merge(target[k], source[k]);
        } else {
            target[k] = source[k];
        }
    }
};

module.exports = function(app) {
    global.config = {};

    merge(global.config, core.all);
    merge(global.config, core[env]);

    global.config.app = {
        key: app.key,
        port: process.env.PORT || app.port,
        base: app.base
    }

    merge(global.config, app[env])
};
