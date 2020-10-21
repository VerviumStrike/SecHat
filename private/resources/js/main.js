//Start up
const SocketClient = io.connect(window.location.href)
const Username = prompt("Username: ")
var usersid = []

//Main
OnJoined()
function OnJoined(){
    if(Username != null){
        if(Username.length >= 20){
            location.href = "/"
        }else{
            usr = Username
            SocketClient.emit("onjoined", Username)
        }
    }
}

document.addEventListener("keyup", (key) => {
	if (key.key == "Enter"){
        var Message = document.getElementById("s-u-message")
        if(Message.value != null){
            if(161 <= Message.value.length){
                Message.value = "[SecHat] Error: the message has exceeded 161 characters."
                return
            }else{
                SocketClient.emit("message", { username: Username, message: Message.value })
                Message.value = ""
            }
        }
    }
})

function Send(){
    var Message = document.getElementById("s-u-message")
    if(Message.value != null){
        if(161 <= Message.value.length){
            Message.value = "[SecHat] Error: the message has exceeded 161 characters."
            return
        }else{
            SocketClient.emit("message", { username: Username, message: Message.value })
            Message.value = ""
        }
    }
}

SocketClient.on("onleft", function(ID){
    for( ausersid in usersid){
        if(ID == usersid[ausersid].id){
            var MessageChat = document.getElementById("messages")
            var Createmsg = document.createElement("h1")
            Createmsg.innerHTML = `${usersid[ausersid].name} has left the chat.`
            Createmsg.style = "color: #0984f7; font-size: 19px;"
            MessageChat.appendChild(Createmsg)
            delete usersid[ausersid]
            console.log(usersid)
        }
    }
})

SocketClient.on("onjoined", function(data){
    usersid.push({ name: data.name, id: data.id})
    var MessageChat = document.getElementById("messages")
    var Createmsg = document.createElement("h1")
    Createmsg.innerHTML = data.message
    Createmsg.style = "color: #0984f7; font-size: 19px;"
    MessageChat.appendChild(Createmsg)
})

SocketClient.on("message", function(data){
    var MessageChat = document.getElementById("messages")
    var Createmsg = document.createElement("h1")
    Createmsg.innerHTML = `${data.username}: ${data.message}`
    Createmsg.style = "color: #0984f7; font-size: 19px;"
    MessageChat.appendChild(Createmsg)
})