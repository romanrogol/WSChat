var WebSocket = require('ws');
var ip = "localhost";

if (process.argv.length === 3) {
  ip = process.argv[2];
}
var ws = new WebSocket('ws://' + ip + ':3000');

ws.onmessage = function(evt) {
  var message = evt.data;
  console.log(message);
}

process.stdin.on('data', function(data) {
  ws.send(data.toString().trim());
});
