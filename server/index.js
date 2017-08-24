var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/../client'));

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

io.on('connection', function (socket) {
	var currentRoom = ''
	
	socket.on('join', function (data) {
		if (data.name) {
			currentRoom = data.roomName
			socket.join(data.roomName, function () {
				
					});

			socket.user = data.name;
			socket.room = data.roomName;
			io.to(data.roomName).emit('user', data.name);
		}	
	});

	socket.on('leave', function(){
		io.to(currentRoom).emit('left', socket.user )
	})

	socket.on('message', function (data) {
		if (data) {
			data.user = socket.users
			io.to(data.roomName).emit('message', data);
		}	
	});

	socket.on('disconnect', (reason) => {
		io.to(currentRoom).emit('left', socket.user);
	})
});
	