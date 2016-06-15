var hbs = require('hbs'),
    moment = require('moment');

hbs.registerHelper('checktype', function(conditional, options) {
    if (conditional == options.hash.equals) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('issame', function(conditional1, conditional2, options) {
    if (conditional1 == conditional2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('isother', function(conditional1, conditional2, options) {
    if (conditional1 != conditional2 && conditional1 != null || conditional1 != conditional2 && conditional1 != undefined) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('datefronow', function(conditional) {
    return moment(conditional).startOf('day').fromNow();
});

hbs.registerHelper('dateformat', function(conditional) {
    return moment(conditional).format('LL');
});

hbs.registerHelper('beginEnd', function(conditional,conditional2) {
    return moment(conditional).format('DD MMM') + '  - ' + moment(conditional2).format('ll');
});
