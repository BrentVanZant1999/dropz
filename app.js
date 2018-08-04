//app.js
var DEBUG = true;
var EVENT_LEN = 120; 
var MINUTE_LEN = 60;
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
var Entity = function(){
    var self = {
        lng:250,
        lat:250,
        id:0,
        name:"",
        description:"",
		type:"",
		time:EVENT_LEN,
		timeSec:0
    }
    self.update = function(){
        self.updateTime();
    }
    self.updateTime = function(){
        self.timeSec--;
		if (self.timeSec < 0 )
		{
			self.time--;
			self.timeSec = MINUTE_LEN; 
		}
    }
    return self;
}

var EventEntity = function(idInput,nameInput,descriptionInput,typeInput,longitude,latitude){
    var self = Entity();
    self.id = idInput;
	self.name = nameInput;
	self.description = descriptionInput;
	self.type= typeInput;
	self.lng = longitude;
	self.lat = latitude; 
    self.lng = longitude;
	
    var super_update = self.update;
    self.update = function(){
        //potential update functions 
        super_update();
    }
    Event.list[id] = self;
    return self;
}
EventEntity.list = {};

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
 
//update events every second. 
setInterval(function(){   
    for(var i in SOCKET_LIST){
		dataSent = "First trial";
		socket = SOCKET_LIST[i];
        socket.emit('testMessage',dataSent);
    }
},1000);