const express = require('express');
const path = require('path');
const {v4: uuidv4} = require('uuid');
const http = require('http');
const chalk = require('chalk');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
// const {ExpressPeerServer} = require('peer');
// const peerServer = ExpressPeerServer(server, {
//     debug: true,
// });

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'/public');
const viewsPath = path.join(__dirname,'/views');

// app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.set('views', viewsPath)
app.use(express.static(publicPath))

app.get('/', (req, res)=> {
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('index',{roomId: req.params.room});
})

io.on('connection', socket => {
    socket.on('join-room', (roomID, userid) => {
        console.log(chalk.bgGray('roomid: ' + roomID + ", userid: " + userid));
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('user-connected', userid)
        socket.on('message', message => {
            io.to(roomID).emit('create-message', message);  
        })
    })
    socket.on('disconnect', (roomID,userid) => {
        socket.to(roomID).broadcast.emit('user-disconnected',userid)
    })
})

server.listen(PORT, () => {
    console.log("listing on the port " + PORT);
})

