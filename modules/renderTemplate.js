var renderTemplate = function(res, template, data, general, postUrls, error, layout) {
    res.render(template, {
        title: general.title,
        data: {
            general: data.general || null,
            allDisplays: data.displays || null,
            allContents: data.content,
            specificId: data.specificId,
            url: null || data.url
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
            content: postUrls.content || null,
            displays: postUrls.displays || null
        },
        error: error,
        navPosition: general.navPosition,
        layout: layout || 'layout'
    });
};

module.exports = renderTemplate;
