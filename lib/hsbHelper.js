var hbs = require('hbs'),
    moment = require('moment');

//to check the type
/**               //the variable          what the varible should be
 *  {{#checktype data.general.type equals="poster" }}
 *    //the content you want to show
 *   {{/checktype}}
 */

hbs.registerHelper('checktype', function(conditional, options) {
    if (conditional == options.hash.equals) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

//to check if the two vars are the same
/**
 *  {{#issame id ../data.specificId}}
 * //what should be displayed if the two vars are the same
 *   {{/issame}}
 */

hbs.registerHelper('issame', function(conditional1, conditional2, options) {
    if (conditional1 == conditional2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

//checks if its an other conditional
/**
 *              //first var   //scond var
 *  {{#isother slideshowId ../data.specificId}}
 *   //what should be displayed if the two vars are diferend
 *  {{/isother}}
 *
 */


hbs.registerHelper('isother', function(conditional1, conditional2, options) {
    if (conditional1 != conditional2 && conditional1 != null || conditional1 != conditional2 && conditional1 != undefined) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

/**COnferts the date to the sime form now (moment function)
* {{#datefronow data.general.dataCreated}}{{/datefronow}}
*/

hbs.registerHelper('datefronow', function(conditional) {
    return moment(conditional).startOf('day').fromNow();
});

/**COnferts the date to a LL format
* {{#dateformat data.general.dateStart}}{{/dateformat}}
*/

hbs.registerHelper('dateformat', function(conditional) {
    return moment(conditional).format('LL');
});

/**COnferts the date to a nl format (12-06-2016) (moment function)
* {{#dateformatnl data.general.dateStart}}{{/dateformatnl}}
*/
hbs.registerHelper('dateformatnl', function(conditional) {
    return moment(conditional).format('L');
});

/** Returns the dates in a string -
* {{#beginEnd data.general.dateStart data.general.dateEnd}}{{/beginEnd}}
*/

hbs.registerHelper('beginEnd', function(conditional, conditional2) {
    return moment(conditional2).format('ll') + '  - ' + moment(conditional2).format('ll');
});
