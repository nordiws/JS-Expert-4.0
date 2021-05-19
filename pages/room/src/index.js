import { constants } from "../../_shared/constants.js"
import SocketBuilder from "../../_shared/socketBuilder.js"

const socketBuilder = new SocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room
})


const socket = socketBuilder
    .setOnUserConnected((user) => console.log('user connected', user))
    .setOnUserDisconnected((user) => console.log('user disconnected', user))
    .build()


const room = {
    id: Date.now(),
    topic: "JS Expert 4.0"
}

const user = {
    img: "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
    username: "nordiws"
}

socket.emit(constants.events.JOIN_ROOM, { user, room })