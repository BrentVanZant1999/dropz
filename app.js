//app.js
var DEBUG = true;

var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(2000);
console.log("Server started.");
var connectionCount = 0; 
var SOCKET_LIST = {}; 

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    SOCKET_LIST[connectionCount] = socket;
    socket.id = connectionCount;
	console.log(socket.id);
	console.log("Connection Number :"+connectionCount); 
   	connectionCount++;
    socket.on('disconnect',function(){
        console.log("Lost Connection Number :"+socket.id);
		delete SOCKET_LIST[socket.id];
    });
    socket.on('userInput',function(data){
		//user input is the data variable passed into this callback function
    });
});
 
//loop through data emitting every 25 miliseconds. 
setInterval(function(){   
    for(var i in SOCKET_LIST){
		dataSent = "First trial";
		socket = SOCKET_LIST[i];
        socket.emit('testMessage',dataSent);
    }
},1000/25);