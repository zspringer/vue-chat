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
			currentRoom = data.room
			socket.join(data.room, function () {
				
					});

			socket.user = data.name;
			socket.room = data.room;
			console.log(data.room)
			io.to(data.room).emit('user', data.name);
		}	
	});

	socket.on('leave', function(){
		io.to(currentRoom).emit('left', socket.user )
	})

	socket.on('message', function (data) {
		if (data) {
			data.user = socket.user
			console.log(data.message)
			io.to(currentRoom).emit('message', data);
		}	
	});

	socket.on('disconnect', (reason) => {
		io.to(currentRoom).emit('left', socket.user);
	})
});
	