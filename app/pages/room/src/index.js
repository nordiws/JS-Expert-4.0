import { constants } from "../../_shared/constants.js"
import RoomController from "./controller.js"
import RoomSocketBuilder from "./util/roomSocketBuilder.js"
import View from "./view.js"

const urlParams = new URLSearchParams(window.location.search)
const keys = ['id', 'topic']
const urlData = keys.map((key) => [key, urlParams.get(key)])

const user = {
    img: "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
    username: "nordiws " + Date.now()
}

const roomInfo = {
    room: { ...Object.fromEntries(urlData) },
    user
}

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room
})

const dependencies = {
    roomInfo,
    socketBuilder,
    view: View,
}

await RoomController.initialize(dependencies)