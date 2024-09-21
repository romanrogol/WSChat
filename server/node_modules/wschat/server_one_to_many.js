var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3000});

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log(message);
  });

  process.stdin.on('data', function (data) {
    var msg = data.toString().trim();
    ws.send(msg);
  });
});
