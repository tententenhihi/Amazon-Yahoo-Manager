var socketIO = null;
class SocketIOService {
    constructor(socket) {
        if (socketIO === null) {
            socketIO = socket;
        }
        socketIO.on('connection', function (socket) {
            // console.log('a user connected: ', socket.id);
            socket.on('disconnect', function () {
                // console.log('user disconnected: ', socket.id);
            });
        });
    }

    static emitData(idUser, data) {
        socketIO.emit(idUser + '-' + data.type, data);
    }
}

module.exports = SocketIOService;
