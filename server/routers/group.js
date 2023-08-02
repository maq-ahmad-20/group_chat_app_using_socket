const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group");
const Authentication = require("../UserAuthentication/auth");

router.get("/getAllGroups", Authentication.authentiateUser, groupController.getGroups);

router.get("/getAllGroupMembers/:groupname", groupController.getAllMembersOfSelectedGroup)

router.post("/createGroup", Authentication.authentiateUser, groupController.createGroup);

router.post('/addToExistingGroup', Authentication.authentiateUser, groupController.addMembersToExistingGroup)

router.post('/deleteUsersFromGroup', Authentication.authentiateUser, groupController.deleteMembersFromGroup)

router.post('/makeMemberAdmin', Authentication.authentiateUser, groupController.makeMemberAdmin)


module.exports = router;