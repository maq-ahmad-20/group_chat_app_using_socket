const chaturl = 'http://localhost:9000/group'
const createuserBtn = document.getElementById('createGroup')
const deleteUserBtn = document.getElementById('deleteGroupMembers')
const addMemberToExistingGrpBtn = document.getElementById('addToExistingGroup')
const showMembersOnScreenBtn = document.getElementById('ShowGroupMembers')
console.log(createuserBtn)

async function createGroup() {
    try {
        const groupName = prompt("Group Name");
        const groupMembers = [];
        let userInput;
        while (userInput !== "ok") {
            userInput = prompt(
                `Enter the valid email of users you want  and type ok to create group`
            );
            if (userInput !== "ok") {
                groupMembers.push(userInput);
            }
        }
        console.log(groupName)
        console.log(groupMembers)
        const token = localStorage.getItem("token");
        const res = await axios.post(
            `${chaturl}/createGroup`,
            {
                groupName: groupName,
                groupMembers: groupMembers,
            },
            { headers: { Authorization: token } }
        );
        alert(`${groupName} Created Successfully!`);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }

}






function addGroupToScreen(groupname) {

    let tablegroups = document.getElementById('tableGroups');

    let tr = document.createElement('tr');


    //li.addEventListener('click', getGroupChatScreen())
    let groubBody = `<td class="name" id="${groupname}" onclick=getGroupChatScreen('${groupname}')>${groupname}</td>`
    tr.innerHTML = groubBody;
    tablegroups.appendChild(tr)

}

async function getAllGroups() {

    try {
        let groups = document.getElementById('groups');
        const token = localStorage.getItem("token");
        const groupData = await axios.get(`${chaturl}/getAllGroups`, {
            headers: { Authorization: token },
        });
        groups.innerHTML = "";

        console.log(groupData.data.chatgroups)
        groupData.data.chatgroups.forEach((group) => {
            addGroupToScreen(group.groupname)
        })

    } catch (err) {
        console.log(err)
    }

}


async function deleteUseFromGroup() {
    try {
        const groupName = prompt("Enter Existed Group Name ");
        const groupMembers = [];
        let userInput;
        while (userInput !== "ok") {
            userInput = prompt(
                `Enter the valid email Id of Users to delete from group and enter ok to delete`
            );
            if (userInput !== "ok") {
                groupMembers.push(userInput);
            }
        }
        const token = localStorage.getItem("token");
        const res = await axios.post(
            `${chaturl}/deleteUsersFromGroup`,
            {
                groupName: groupName,
                groupMembers: groupMembers,
            },
            {
                headers: { Authorization: token },
            }
        );
        alert(res.data.message);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

async function addUserToExistingGroup() {
    try {
        const groupName = prompt("Enter Existing Group Name");
        const groupMembers = [];
        let userInput;
        while (userInput !== "ok") {
            userInput = prompt(
                `Enter the valid email of users you want  and type ok to add users to selected group`
            );
            if (userInput !== "ok") {
                groupMembers.push(userInput);
            }
        }
        console.log(groupName)
        console.log(groupMembers)
        const token = localStorage.getItem("token");
        const res = await axios.post(
            `${chaturl}/addToExistingGroup`,
            {
                groupName: groupName,
                groupMembers: groupMembers,
            },
            { headers: { Authorization: token } }
        );
        alert(res.data.message);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }


}


function addGroupMembersToScreen(member, groupname, index, admin) {

    let memberTableBody = document.getElementById('displayAllMembersOfSelectedGroup');

    let tr = document.createElement('tr');

    console.log(member.id)

    let memberBody = `<td>${index + 1}</td><td>${groupname}</td><td>${member.username}</td><td>${member.useremail}</td><td>${admin}</td>
    <td><button class="btn btn-primary" onclick = "makeMemberAdmin('${groupname}' ,'${member.id}')">MakeAdmin</button></td>`
    tr.innerHTML = memberBody;
    memberTableBody.appendChild(tr)

}

async function showGroupMembers() {

    try {
        const groupNameObj = localStorage.getItem('groupname');
        if (!groupNameObj) {
            return alert('Hey Please select a group')
        } else {
            const groupName = groupNameObj;
            let groupMembersData = await axios.get(`${chaturl}/getAllGroupMembers/${groupName}`)

            console.log(groupMembersData.data.groupMembers)

            let membersObject = JSON.stringify(groupMembersData.data.groupMembers)
            document.getElementById('displayAllMembersOfSelectedGroup').innerHTML = ""
            groupMembersData.data.groupMembers.forEach((member, index) => {
                console.log(member.username)
                console.log(member.usergroups[0].groupname)

                addGroupMembersToScreen(member, member.usergroups[0].groupname, index, member.usergroups[0].isadmin)
            })
        }

    } catch (err) {
        console.log(err)
    }

}


async function makeMemberAdmin(groupname, userid) {
    try {


        // const groupMembers = [];
        // let userInput;
        // while (userInput !== "ok") {
        //     userInput = prompt(
        //         `Enter the valid email of users you want to make admin and type ok`
        //     );
        //     if (userInput !== "ok") {
        //         groupMembers.push(userInput);
        //     }
        // }

        console.log(groupname)

        const token = localStorage.getItem('token');

        let result = await axios.post(`${chaturl}/makeMemberAdmin`,
            { groupName: groupname, userid: userid }
            , { headers: { Authorization: token } }
        )


        alert(result.data.message);
        window.location.reload();



    } catch (err) {
        console.log(err)
    }
}
function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('groupname')
    window.location.replace("../login/login.html");
}

showMembersOnScreenBtn.addEventListener('click', showGroupMembers)
createuserBtn.addEventListener('click', createGroup)
deleteUserBtn.addEventListener('click', deleteUseFromGroup)
addMemberToExistingGrpBtn.addEventListener('click', addUserToExistingGroup)

document.addEventListener('DOMContentLoaded', getAllGroups)