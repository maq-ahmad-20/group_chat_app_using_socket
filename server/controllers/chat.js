

const Chat = require('../models/chatModel');
const User = require('../models/userModel')
const chatGroups = require('../models/chatGroup')
const { Sequelize, Op } = require('sequelize')


// const http = require('http').Server(app)
// const io = require('socket.io')(http)




exports.postUserMessageToDB = async (req, res, next) => {

    try {

        console.log(req.user)
        console.log(req.body)
        //const userId = req.user.id
        const groupname = req.body.groupname.toString()
        let chatGroup = await chatGroups.findOne({ where: { groupname: groupname } })

        let postedMessage = await Chat.create({
            username: req.user.username,
            usermessage: req.body.message,
            userId: req.user.id,// foreignkey
            chatgroupId: chatGroup.dataValues.id
        })

        return res.status(200).json({ message: postedMessage })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "error" })
    }
}

exports.getAllMessages = async (req, res, next) => {

    try {
        //const latestId = +req.params.latestId
        const groupname = req.params.groupname.toString()
        //console.log(latestId)
        console.log(groupname)

        let chatGroup = await chatGroups.findOne({ where: { groupname: groupname } })

        let userMessages = await Chat.findAll({
            where: {

                chatgroupId: chatGroup.dataValues.id

            }
        })

        console.log(userMessages)

        return res.status(200).json({ messages: userMessages })


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "error" })
    }
}


