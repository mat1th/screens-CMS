var renderTemplate = function(res, template, data, general, postUrls, error, layout) {
    res.render(template, {
        title: general.title,
        data: {
            general: data.general || null,
            allScreens: data.screens
        },
        rights: {
            admin: general.admin,
            editor: general.editor,
            logedin: general.login
        },
        navStyle: general.navStyle,
        postUrl: {
            general: postUrls.general || null,
            settings: postUrls.settings || null,
            screens: postUrls.screens || null,
            displays: postUrls.displays || null
        },
        error: error,
        navPosition: general.navPosition,
        layout: layout || 'layout'
    });
};

module.exports = renderTemplate;
