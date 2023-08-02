const express = require('express');
const sequelize = require('./util/db')
const fs = require('fs')
const cors = require('cors');
const User = require('./models/userModel')
const Chats = require('./models/chatModel')
const UserGroup = require('./models/UserGroup')
const chatGroup = require('./models/chatGroup')
const userSignUpRouter = require('./routers/usersignup')
const loginRouter = require('./routers/login')
const chatRouter = require('./routers/chat')
const groupRouter = require('./routers/group')
const path = require('path')
require('dotenv').config()

const app = express();
app.use(cors())
app.use(express.static(path.join(__dirname, '../', 'Client')))



const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");





//app.use(express.static("../Client/chat/chat.html"));
// app.use(cors({
//     origin: process.env.ORIGIN,
//     methods: ["GET", "POST"]
// }))



app.use(express.json())

app.use('/user', userSignUpRouter)
app.use(loginRouter)
app.use(chatRouter)
app.use('/group', groupRouter)


User.hasMany(Chats, { onDelete: "CASCADE" })
Chats.belongsTo(User)

UserGroup.belongsTo(User)
User.hasMany(UserGroup)


Chats.belongsTo(chatGroup);
chatGroup.hasMany(Chats)

chatGroup.hasMany(UserGroup)
UserGroup.belongsTo(chatGroup)










sequelize.sync({ alter: true }).then((result) => {


    server.listen(9000);

    const io = new Server(server, {
        cors: {
            origin: "http://lcoalhost:5500",
            methods: ['GET', 'POST'],
            allowedHeaders: ["my-custom-header"],
            credentials: true,
        }
    });


    io.on("connection", (socket) => {
        socket.on("message", (message) => {


            socket.broadcast.emit('message', message);

        });
    });

    console.log(process.env.PORT)
    console.log("Sequalizeworking and listening to port ")
})
