import { constants } from "../../_shared/constants.js"
import RoomSocketBuilder from "./util/roomSocket.js"

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room
})


const socket = socketBuilder
    .setOnUserConnected((user) => console.log('user connected', user))
    .setOnUserDisconnected((user) => console.log('user disconnected', user))
    .setOnRoomUpdated((room) => console.log('room list!', room))
    .build()


const room = {
    id: '0001',
    topic: "JS Expert 4.0"
}

const user = {
    img: "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
    username: "nordiws " + Date.now()
}

socket.emit(constants.event.JOIN_ROOM, { user, room })