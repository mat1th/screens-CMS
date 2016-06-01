var renderTemplate = function(res, template, data, general, postUrls, error) {
    res.render(template, {
        title: general.title,
        data: {
            general: data.general || null
                // usedposters: usedposters || null,
                // allPosters: allPosters,
                // displays: displayMatch,
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
        error: error
    });
};

module.exports = renderTemplate;
