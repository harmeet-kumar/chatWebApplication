// requires
var express = require('express');
var bp = require('body-parser');
var cp = require('cookie-parser');
var session = require('./middleware/session');
var authentication = require('./middleware/authentication');
var authorisation = require('./middleware/authorisation');

//for chat
var http = require('http');
var socketIo = require('socket.io');

var mainRoute = require('./routes/main');

// create app
var app = express();

//for chat server
var httpServer = http.Server(app);

httpServer.listen(3000, httpServerConnected);
function httpServerConnected(){
	setInterval(function(){
  	var gs = global.sessions;

  	if(gs){
  		var prop;
  		for(prop in gs){
  			if(Date.now() - gs[prop].lastAccessedOn > 10 * 60 * 1000){
  				delete gs[prop];
  			}
  		}
  	}

  }, 1 * 60 * 60 * 1000);
	console.log("Web Server started at 3000");
}
// socket area
var ioServer = socketIo(httpServer);
var allUsers = {};

ioServer.on('connection', ioServerConnected);
function ioServerConnected(socket){
	socket.on('custom-msg', msgReceived);
	socket.on('disconnect', socketDisconnected)
}

// set middleware
app.use(express.static('public'));

app.use(bp.urlencoded({
  extended: true
}));
app.use(bp.json());
app.use(cp());
app.use(session);
app.use(authentication([
  'issues',
  'employees'
]));
app.use(authorisation([]));




// set routes
mainRoute.init({
	app: app,
	dbConfig: {
	    user: 'sa',
	    password: 'Passw0rd',
	    server: 'localhost', 
	    database: 'EmployeePortal'
	}
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/test', function (req, res) {
  res.send('hello world')
})

// start application
// app.listen(3000, function () {
//   setInterval(function(){
//   	var gs = global.sessions;

//   	if(gs){
//   		var prop;
//   		for(prop in gs){
//   			if(Date.now() - gs[prop].lastAccessedOn > 10 * 60 * 1000){
//   				delete gs[prop];
//   			}
//   		}
//   	}

//   }, 1 * 60 * 60 * 1000);
//   console.log('Example app listening on port 3000!');
// });


///// chat area




// Socket Area

function msgReceived(msgData){
	var socket = this;

	if(msgData.type == 'new-user'){
		
		socket.broadcast.emit('custom-msg', msgData);
		socket.emit('custom-msg', {
			type: 'existing-users',
			info: Object.keys(allUsers)
		});

		allUsers[msgData.info.userName] = {};
		allUsers[msgData.info.userName].socket = socket;
	} else if(msgData.type == 'new-msg'){
		if(msgData.info.to == 'All'){
			socket.broadcast.emit('custom-msg', msgData);
		} else {
			allUsers[msgData.info.to].socket.emit('custom-msg', msgData);
		}
	}
	else if(msgData.type === 'delete')
	{
		delete allUsers[msgData.info.from];
	}
	else if(msgData.type==='removeUser')
	{
		allUsers[msgData.info.user].socket.broadcast.emit('custom-msg',msgData);
	}

}

function socketDisconnected(){
	console.log('User Disconnected')
}