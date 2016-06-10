function sendRefresh(id, refresh) {
    var data = {
        id: id,
        refresh: refresh
    }

    global.io.emit('display reload', data);
}

module.exports = sendRefresh;
