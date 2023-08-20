const CronJob = require("cron").CronJob;
const sequelize = require("../util/db");
const Sequelize = require("sequelize");
const Chat = require("../models/chatModel");
const ArchivedChat = require("../models/ArchivedChats");

exports.job = new CronJob("0 0 * * *", function () {

    console.log("cronjob running")
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
    Chat.findAll({
        where: {
            createdAt: {
                [Sequelize.Op.lt]: yesterday,
            },
        },
    }).then((chats) => {
        ArchivedChat.bulkCreate(chats).then(() => {
            Chat.destroy({
                where: {
                    createdAt: {
                        [Sequelize.Op.lt]: yesterday,
                    },
                },
            });
        });
    });
});

