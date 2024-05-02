require('dotenv').config();
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const userChat = require('./controllers/userChat');
const session = require('express-session');

// bringing in socket
const socket = require('socket.io');
// bringing in the http module so that server can handle sockets
const http = require('http');
const app = express();

// create server using http and express for socket
const server = http.createServer(app);
const io = socket(server);

// connect to mongoDB
const dbURI = process.env.DBURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected to db')
        // listen for request only after database has connected
        const port = process.env.PORT || 3000;
        server.listen(port)
    })
    .catch((err) => {
        console.log(err)
    })


// register view engine
app.set('view engine', 'ejs')

// middleware for static files
app.use(express.static('public'))
// middleware to process form datas
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setting d express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// run when a client connects
io.on('connection', (socket) => {
    // listen for details (userid and username) sent from front end
    socket.on('userWelcome', (data) => {
        // send message to every user connected except for thr user thats connecting
        socket.broadcast.emit('userWelcome', data)
    })

    // listen for user message sent from front end
    socket.on('chatMessage', async (msg) => {
        // save to database
        const savechat = await userChat.saveChat(msg)
        if (savechat === true){ 
            // this is for everyone in general
            io.emit('message', msg)
        }else{
            io.emit('message', msg);
        }
    })
 
    // runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
})

// basic routes
app.use('/', userRoute)

// chat routes
app.use('/chat', chatRoute)

// 404 route
app.use((req, res) => {
    res.status(404).render('404')
})