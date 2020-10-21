//Requirements Importer
const Express = require("express")
const Ngrok = require("ngrok")

//Variables
const Settings = require("./private/security/noO_Zpass/settings.json")
const Port = process.env.PORT || 8519
const Web = Express()

//Functions
async function NgrokServer(){
    try{
        var Url = await Ngrok.connect({
            proto: Settings.proto,
            addr: 8519,
            authtoken: Settings.authtoken,
            region: Settings.region
        })
        console.log(`Chat website: ${Url}`)
    }catch(error){
        console.log(`NgrokServer error: ${error}`)
    }
}

async function OnConnect(Connection){
    console.log(`Someone connect/connected to the server. ID:${Connection.id}`)
}

async function OnDisconnect(Connection){
    console.log(`Someone disconnect/disconnected to the server. ID:${Connection.id}`)
}

//Express
Web.use(Express.static(__dirname + "/private"))
const Server = Web.listen(Port, ()=>{
    NgrokServer()
})

//Socket Server
const SocketHandler = require("socket.io")
const SocketServer = SocketHandler(Server)

//Main
SocketServer.sockets.on("connection", function(Connection){
    OnConnect(Connection)

    Connection.on("onjoined", function(username){
        SocketServer.sockets.emit("onjoined", { name: username, id: Connection.id, message: `${username} has joined the chat.`})
    })

    Connection.on("message", function(data){
        SocketServer.sockets.emit("message", data)
    })

    Connection.on("disconnect", function(){
        SocketServer.sockets.emit("onleft", Connection.id)
        OnDisconnect(Connection)
    })
})