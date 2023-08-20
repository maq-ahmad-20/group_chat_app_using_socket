const sequelize = require("../util/db");
const Sequelize = require("sequelize");

const ArchivedChat = sequelize.define("archivedChats", {
    archiveid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
    },
    usermessage: {
        type: Sequelize.STRING,
    },
    userId: {
        type: Sequelize.INTEGER,
    },
    chatGroupId: {
        type: Sequelize.INTEGER,
    },
});

module.exports = ArchivedChat;
