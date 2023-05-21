const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const {authRoutes} = require('./Routes/authRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const userRoutes = require('./Routes/userRoutes')
const path = require('path')

dotenv.config()
connectDB()

const app = express()

app.use(express.json())

//app.get('/', (req, res) => {
//    res.send('API started successfully')
//})
 
app.use('/api/users', authRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/users', userRoutes)
app.use('/api/message', messageRoutes)


const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/build')))
    
    app.get('*', (req, res) => 
        res.sendFile(path.resolve(__dirname1,'frontend','build', 'index.html'))
    )
} else {
    app.get('/', (req, res) => {
        res.send('API is running successfully')
    })
}

const PORT = process.env.PORT || 4000 
 const server =app.listen(PORT, console.log(`Server started on port ${PORT}`))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3001'
    },
})

io.on('connection', (socket) => {
    console.log('connected to socket.io')

    socket.on('setup', (userData) => {
        socket.join(userData._id)
       // console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room);
       // console.log('User Joined Room:' + room)
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))
    socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

        if (!chat.users) return
        //console.log('chat.users not defined');

    chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return
        
        socket.in(user._id).emit('message recieved', newMessageRecieved)
    });
   })
})
