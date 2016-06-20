function sendRefresh(id, refresh) { //sends a refrech to the slideshow on the screen
    var data = {
        id: id, // the id of the display
        refresh: refresh //refrech  true of false
    };

    global.io.emit('display reload', data);
}

module.exports = sendRefresh;
