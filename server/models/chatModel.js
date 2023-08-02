const sequelize = require("../util/db");
const Sequelize = require("sequelize");

const Chat = sequelize.define("chats", {
    id: {
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
    }
});

module.exports = Chat;