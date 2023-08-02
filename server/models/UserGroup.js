const sequelize = require("../util/db");
const Sequelize = require("sequelize");

const UserGroup = sequelize.define("usergroups", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    groupname: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    isadmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,

    }
});

module.exports = UserGroup;