# DevX
- DevX is a social platform for developers to connect based on their interests



# Socket.IO server API



- require http and replace app with the server given by http.createServer()
- do server = http.createSever(app){app is you express app}
- replace app.listen with server.listen
- create socket.js file and install socket.io npm i socket.io
- const socket = require("socket.io)
- const io = new socket(server,{
    congifuration such as cors
})
- io.on("connection",(socket)=>{
    //handle events 
})

- socket server connection is set up