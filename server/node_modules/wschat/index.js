var WebSocketServer = require('ws').Server;

module.exports = startAll;

function startAll() {
  var wss = new WebSocketServer({port: 3000});
  var connections = [];

  console.log('listening on port 3000');

  wss.on('connection', function(ws) {
    ws.on('message', function(message) {
      console.log(message);
      connections.forEach(function(elem) {
        if (elem !== ws) {
          elem.send(message);
        }
      })
    });

    console.log('client connected');
    connections.push(ws);
  });

  process.stdin.on('data', function (data) {
    var msg = data.toString().trim();

    connections.forEach(function(elem) {
      elem.send(msg);
    })
  });
}
