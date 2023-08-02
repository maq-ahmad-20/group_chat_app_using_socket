const Sequelize = require("sequelize");
const sequelize = require("../util/db");

const ChatGroup = sequelize.define("chatgroups", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    groupname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,

    },
    owner: {
        type: Sequelize.STRING,
        allowNull: false,

    }
});

module.exports = ChatGroup;