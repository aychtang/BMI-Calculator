var app = require('express')();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server, {log: false});
var fs = require('fs');
var qs = require('querystring');
var mysql = require('mysql');

//--------------------------------------------------------

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bmi'
});

app.get('/', function(request, response){
    fs.readFile('index.html', function(err, data){
      if(err){
        throw err;
      }
      response.end(data);
    });
});

app.get('/css.css', function(request, response){
fs.readFile('css.css', function(err, data){
      if(err){
        throw err;
      }
      response.end(data);
    });
});

app.get('/app.js', function(request, response){
    fs.readFile('app.js', function(err, data){
      if(err){
        throw err;
      }
      response.end(data);
    });
});

//--------------------------------------------------------

io.sockets.on('connection', function(socket){
  socket.on('message', function(data){
    var message = JSON.parse(data);
    connection.query('INSERT INTO userinfo SET ?', message, function(err, data){
    });

    connection.query('SELECT AVG(bmi) FROM userinfo', function(err, data){
      console.log(data);
      socket.emit('postData', data[0]);
      socket.broadcast.emit('postData', data[0]);
    });
  });
});

server.listen(8080);