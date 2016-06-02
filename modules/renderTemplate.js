var renderTemplate = function(res, template, data, general, postUrls, error, layout) {
    res.render(template, {
        title: general.title,
        data: {
            general: data.general || null,
            // usedposters: usedposters || null,
            allPosters: data.posters
            // displays: data.posters,
            // slideshowSettings: slideshowSettings || null
        },
        rights: {
            admin: general.admin,
            logedin: general.login
        },
        navStyle: general.navStyle,
        postUrl: {
            general: postUrls.general || null,
            settings: postUrls.settings || null,
            posters: postUrls.posters || null,
            displays: postUrls.displays || null
        },
        error: error,
        navPosition: general.navPosition,
        layout: layout || 'layout'
    });
};

module.exports = renderTemplate;
