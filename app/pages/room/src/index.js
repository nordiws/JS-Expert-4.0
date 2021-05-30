import { constants } from "../../_shared/constants.js"
import Media from "../../_shared/media.js"
import PeerBuilder from "../../_shared/peerBuilder.js"
import RoomController from "./controller.js"
import RoomService from "./service.js"
import RoomSocketBuilder from "./util/roomSocketBuilder.js"
import View from "./view.js"
import UserDB from '../../_shared/userDB.js'

const user = UserDB.get()
if (!Object.keys(user).length) {
    View.redirectToLogin()
}

const urlParams = new URLSearchParams(window.location.search)
const keys = ['id', 'topic']
const urlData = keys.map((key) => [key, urlParams.get(key)])

const roomInfo = {
    room: { ...Object.fromEntries(urlData) },
    user
}

const peerBuilder = new PeerBuilder({
    peerConfig: constants.peerConfig
})

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room
})

const roomService = new RoomService({
    media: Media
})

const dependencies = {
    roomInfo,
    socketBuilder,
    view: View,
    peerBuilder,
    roomService
}

RoomController.initialize(dependencies).catch(error => alert(error.message))