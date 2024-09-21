## Basic Websockets Multi-User Chat

*Connect multiple clients in the browser and/or in the terminal to one chat server.*


## install
```
git clone https://github.com/sean-west/wschat.git
cd wschat
npm install
```

## server
*This will listen on port 3000 by default*
```
node server.js
```

## client
*This will connect to localhost on 3000 by default.*

#### node
*You can pass as an argument an ip address or hostname to connect to a remote chat server.*
```
node client_node.js [hostname]
```

#### browser
*Change the ```ip``` variable to a remote server ip address to connect to that chat server*
```
open client_browser.html
```
