var renderTemplate = function(res, req, template, data, general, postUrls, error, layout) { // render the tempate
    res.render(template, {
        title: general.title,
        piwik: config.piwik.code,
        username: req.session.user_name, // the user name for the edit nav
        data: { //the date fro rendeing in the page
            general: data.general || null,
            allDisplays: data.displays || null,
            allContent: data.content,
            specificId: data.specificId,
            url: null || data.url
        },
        rights: { //the rights for showing the content
            admin: req.admin,
            editor: req.editor,
            logedin: (req.session.user_id !== undefined) ? true : false
        },
        navStyle: general.navStyle, //the nav style class
        postUrl: { // the post urls for the forms
            general: postUrls.general || null,
            settings: postUrls.settings || null,
            content: postUrls.content || null,
            displays: postUrls.displays || null
        },
        error: error, // the error on the page
        pagelayout: general.pagelayout, // the page layout
        styleCookie: req.cookies.style, //the cookie for if the style would be inline or not
        layout: layout || 'layout' // the layout of the app by default use the 'layout' layout
    });
};

module.exports = renderTemplate;
