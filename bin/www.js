#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('chat-app:server');
var http = require('http');




/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
  
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

var Filter = require('bad-words')
  filter = new Filter();
// filter.addWords('xyz','qwe')
// console.log('test',filter.isProfane('xyz'));
// console.log('test',filter.isProfane('qwe'));

//socket.io setup
const socketio = require('socket.io')
const io = socketio(server);

// let s=new socketio.Socket //pt test metode socket.io
// s.

// porneste conexiunea socket pe partea de server
io.on('connection', function (socket) {
  // let count=0

  // console.log('v:new websocket connection')
  // // socket.emit: emit to this client (doar catre 1 client)
  // socket.emit('VcountUpdated',count)

  // socket.on('requestIncrement',function (socket) { 
  //   count++
  //   io.emit('VcountUpdated',count)
  //  })

  // socket.emit('message','Welcome!')
  socket.broadcast.emit('message', 'a new user has joined')
  // io.emit('message', 'a new user has joined')
  socket.on('sendMessage', function (msgFromClient, callbackFromClient) {
    console.log('am primit de la client ', msgFromClient);
    if (filter.isProfane(msgFromClient)) {
      socket.emit('message', 'v:message restricted(profane)')
    } else {
      io.emit('chatmessage', msgFromClient)
    }

    callbackFromClient({ status: 'server:message received' })


    // param 2 ruleaza doar pe socketul care a trimis mesajul
    //param2 este functia emisa cu 'sendMessage'
  })

  //disconnect se emite automat cand un client(socket) se deconecteaza
  socket.on('disconnect', function () {
    io.emit('message', 'one user disconnected')
  })

  socket.on('sendLocation', function (param1, callback) {
    // io.emit('message',param1)
    // socket.broadcast.emit('message',param1)
    // io.emit('chatmessage', `location: lat:${param1.latitude}
    // ,long:${param1.longitude}`)
    // io.emit('chatmessage', `my current location is: www.google.ro/maps/@${param1.latitude},${param1.longitude}`)
        io.emit('chatmessage', `<a href='http://www.google.ro/maps/@${param1.latitude},${param1.longitude}'>My current location</a>`)

    // callback('your location has been shared!')
    socket.emit('chatmessage',
    'your location has been shared ')
  })

})




/**
 * Listen on provided port, on all network interfaces.
 */
  
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('v:listening on port ' + port);
}

module.exports={server}