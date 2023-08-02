
const User = require("../models/userModel");
const chatGroups = require("../models/chatGroup");
const UserGroup = require("../models/UserGroup");
const { Op } = require("sequelize");





exports.createGroup = async (req, res, next) => {

    try {
        const groupName = req.body.groupName;
        const owner = req.user.username;
        const groupMembers = req.body.groupMembers;

        const chatGroup = await chatGroups.create({ groupname: groupName, owner: owner });

        const invitedMembersToGroup = await User.findAll({
            where: {
                useremail: {
                    [Op.or]: groupMembers,
                }
            }
        });

        const allMembersAdded = [];
        invitedMembersToGroup.map(async (user) => {
            console.log(user)

            let addedUser = await UserGroup.create({
                groupname: groupName,
                isadmin: false,
                userId: user.dataValues.id,
                chatgroupId: chatGroup.dataValues.id

            })
            allMembersAdded.push(addedUser)

        })

        await Promise.all(allMembersAdded)


        // owmer whocreated group

        await UserGroup.create({
            groupname: groupName,
            isadmin: true,
            userId: req.user.id,
            chatgroupId: chatGroup.dataValues.id

        })

        return res.status(200).json({ groupName: groupName, groupMembers: groupMembers })


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something went wrong" })
    }
}


exports.getGroups = async (req, res, next) => {

    try {
        const chatgroups = await chatGroups.findAll({
            attributes: ["groupname", "owner"],
            include: [
                {
                    model: UserGroup,
                    where: { userId: req.user.id },
                },
            ],
        });
        res.status(200).json({ chatgroups: chatgroups });


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something went wrong" })
    }
}


exports.deleteMembersFromGroup = async (req, res, next) => {

    try {
        const groupName = req.body.groupName.toString()
        const userid = +req.user.id
        const groupMembers = req.body.groupMembers
        const chatGroup = await chatGroups.findOne({ where: { groupname: groupName } });
        if (chatGroup) {
            const adminUsers = await UserGroup.findAll({
                where: {
                    [Op.and]: [{ isadmin: 1 }, { chatgroupId: chatGroup.id }],
                },
            });

            for (let i = 0; i < adminUsers.length; i++) {
                let adminUser = adminUsers[i];
                if (adminUser.userId === userid) {
                    const toBeDeletedUsers = await User.findAll({
                        where: {
                            useremail: {
                                [Op.or]: groupMembers,
                            },
                        },
                    });


                    const membersToDelete = [];
                    toBeDeletedUsers.forEach(async (user) => {
                        console.log(user)

                        let deletedUser = await UserGroup.destroy({
                            where: {
                                [Op.and]: [{
                                    isadmin: false,
                                    userId: user.dataValues.id,
                                    chatgroupId: chatGroup.dataValues.id
                                }]
                            }
                        })
                        membersToDelete.push(deletedUser)

                    })

                    await Promise.all(membersToDelete)
                    return res.status(200).json({ message: "successfully users got deleted" })

                }
            }

            return res.status(201).json({ message: "Only Admin can delete users" })

        } else {
            res.status(201).json({ message: "Please enter correct groupname" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something Went Wrong" })
    }
}


exports.addMembersToExistingGroup = async (req, res, next) => {
    try {
        const groupName = req.body.groupName
        const groupMembers = req.body.groupMembers
        const userid = +req.user.id
        console.log(req.user.id)
        const groupChat = await chatGroups.findOne({ where: { groupname: groupName } })

        if (groupChat) {
            const adminUsers = await UserGroup.findAll({
                where: {
                    [Op.and]: [{ isadmin: 1 }, { chatgroupId: groupChat.id }],
                },
            });
            for (let i = 0; i < adminUsers.length; i++) {
                let adminUser = adminUsers[i]

                if (adminUser.userId === userid) {
                    const toBeAddedMembers = await User.findAll({
                        where: {
                            useremail: {
                                [Op.or]: groupMembers,
                            },
                        },
                    });

                    let allAddedMembers = []
                    toBeAddedMembers.forEach(async (user) => {
                        let addedMember = await UserGroup.create({
                            groupname: groupName,
                            isadmin: false,
                            userId: user.dataValues.id,
                            chatgroupId: groupChat.dataValues.id
                        })
                        allAddedMembers.push(addedMember)
                    })

                    await Promise.all(allAddedMembers)

                    return res.status(200).json({ message: "successfully users got Added to Existing Group" })

                }
            }

            return res.status(201).json({ message: "Only Admin can Add members" })





        } else {
            res.status(201).json({ message: "Please enter correct Existing groupname" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something Went Wrong" })
    }

}


exports.getAllMembersOfSelectedGroup = async (req, res, next) => {

    try {

        const groupName = req.params.groupname.toString();
        console.log(groupName)

        let chatGroupName = await chatGroups.findOne({ where: { groupname: groupName } })
        console.log(chatGroupName)

        if (chatGroupName) {

            let groupMembers = await User.findAll({
                attributes: ['id', 'username', 'useremail'],
                include: {
                    model: UserGroup,
                    where: {
                        chatgroupId: chatGroupName.dataValues.id
                    }
                },

            })

            console.log(groupMembers)

            res.status(200).json({ groupMembers: groupMembers })


        } else {
            res.status(201).json({ message: "GroupName doesnot exist in DB" })

        }


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something Went Wrong" })
    }
}


exports.makeMemberAdmin = async (req, res, next) => {
    try {

        const groupname = req.body.groupName.toString();

        const userid = +req.body.userid
        const requserId = +req.user.id

        if (groupname) {
            const adminUsers = await UserGroup.findAll({
                where: {
                    [Op.and]: [{ isadmin: 1 }, { groupname: groupname }],
                },
            });
            for (let i = 0; i < adminUsers.length; i++) {
                let adminUser = adminUsers[i]
                if (adminUser.userId === requserId) {
                    const updateMember = await UserGroup.update({ isadmin: 1 },
                        {
                            where: {
                                [Op.and]: [{
                                    groupname: groupname,
                                    userId: userid,

                                }]

                            }
                        })




                    return res.status(200).json({ message: "successfully made member admin" })
                }
            }
        }

        return res.status(201).json({ message: "only Admin can make other members admin of group" })


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something Went Wrong" })
    }
}