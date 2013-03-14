var app = require('express')();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server, {log: false});
var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bmi'
});

var reusableGetter = function(request, response, path){
  fs.readFile(path, function(err, data){
    if (err) {
      throw err;
    }
    response.end(data);
  });
};

app.get('/', function(request, response){
  reusableGetter(request, response, 'index.html');
});

app.get('/css.css', function(request, response){
  reusableGetter(request, response, 'css.css');
});

app.get('/app.js', function(request, response){
  reusableGetter(request, response, 'app.js');
});

io.sockets.on('connection', function(socket){
  socket.on('message', function(data){
    var message = JSON.parse(data);
    connection.query('INSERT INTO userinfo SET ?', message, function(err, data){
    });

    connection.query('SELECT AVG(bmi) FROM userinfo', function(err, data){
      socket.emit('postData', data[0]);
      socket.broadcast.emit('postData', data[0]);
    });
  });
});

server.listen(8080);