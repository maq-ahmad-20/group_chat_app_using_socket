const url = 'http://localhost:9000';



function validateMessage() {
    const enteredMessage = document.getElementById('message').value
    if (enteredMessage === "") {
        return false
    } else {
        return true
    }
}


document.getElementById('sendMessageButton').addEventListener('click', async (e) => {
    if (validateMessage()) {
        try {
            e.preventDefault()
            //const token = localStorage.getItem("token");



            const groupname = localStorage.getItem('groupname')
            console.log(groupname)
            if (!groupname) {
                alert("Please select group or create group to chat")
                location.reload()
            }
            const enteredMessage = document.getElementById('message').value.trim()
            console.log(enteredMessage)
            const token = localStorage.getItem('token')
            console.log(decodeToken(token))
            let postMessage = await axios.post(`${url}/sendMessage`, { message: enteredMessage, groupname: groupname }, { headers: { Authorization: token } })

            console.log(postMessage.data.message)
            addMessagetoChatScreen(postMessage.data.message, "YOU")
            document.getElementById('message').value = ""

            let message = { usermessage: enteredMessage, username: postMessage.data.message.username, userId: postMessage.data.message.id }

            socket.emit("message", message);


            socket.on("message", (message) => {
                console.log(message)

                addMessageToChatScreenLeft(message, message.username)

            })

        } catch (err) {
            console.log(err)
        }
    }
})


function decodeToken(token) {
    const base64Url = token.split(".")[1];
    console.log(base64Url)

    const jsonObj = decodeURIComponent(
        atob(base64Url)

    );
    console.log(jsonObj)
    return JSON.parse(jsonObj);
}

function addMessagetoChatScreen(data, sender) {

    let messagesUl = document.getElementById('chatBoxMessages')
    //console.log(messagesUl)
    let li = document.createElement('li');
    li.className = "clearfix"

    let messagehtml = ` 
    <div class="message-data text-right">
    <span style="display: inline;font-size: small;">${sender}</span>
    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" /></div>
    <div class="message other-message float-right">
       ${data.usermessage}
    </div>
   `
    // console.log(li)
    li.innerHTML = messagehtml;
    messagesUl.appendChild(li)
}

function addMessageToChatScreenLeft(data, sender) {


    let messagesUl = document.getElementById('chatBoxMessages')
    let li = document.createElement('li');
    li.className = "clearfix"

    let messagehtml = ` 
    <div class="message-data text-left">
   
    <img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="avatar" />
    <span style="display: inline;font-size: small;">${sender}</span>
    </div>
    <div class="message other-message float-left">
       ${data.usermessage}
    </div>
   `
    // console.log(li)
    li.innerHTML = messagehtml;
    messagesUl.appendChild(li)

}


//gettingmessagesfromdatabase
async function getAllMessagesFromDB(groupname) {
    try {

        const groupname = localStorage.getItem('groupname')
        if (!groupname) {
            return alert("hey please select or crete group to chat")
        }

        const totalMessages = await axios.get(`${url}/getAllMessages/${groupname}`);
        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token);
        const userid = decodedToken.userid;
        document.getElementById('chatBoxMessages').innerHTML = ""

        console.log(totalMessages.data.messages)

        totalMessages.data.messages.forEach((message) => {
            // console.log(message.userId)
            //console.log(userid)
            if (message.userId === userid) {

                addMessagetoChatScreen(message, "YOU")

            } else {

                addMessageToChatScreenLeft(message, message.username)

            }
        })


    } catch (err) {
        console.log(err)
    }


}




//setInterval(() => storeMessagesInLocalStorageAndAddMessagesToChat(), 3000)

// getiing chats after user clicks on particular chat
async function getGroupChatScreen(groupname) {
    //e.preventDefault()
    try {

        let headingAvtar = `  <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
        <img src="https://cdn3.vectorstock.com/i/1000x1000/24/27/people-group-avatar-character-vector-12392427.jpg" alt="avatar" />
    </a>
    <div class="chat-about">
        <h6 class="m-b-0">${groupname}</h6>
        
    </div>`

        document.getElementById('headingAvtar').innerHTML = headingAvtar


        document.getElementById('displayAllMembersOfSelectedGroup').innerHTML = ""

        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token);
        const userid = decodedToken.userid;
        document.getElementById('chatBoxMessages').innerHTML = ""
        console.log(groupname)

        localStorage.setItem('groupname', groupname)



        await getAllMessagesFromDB(groupname)


    } catch (err) {
        console.log(err)
    }

}






document.addEventListener('DOMContentLoaded', () => {
    const groupname = localStorage.getItem('groupname')
    if (!groupname) {
        alert("Select Groupname to chat")
    }
})