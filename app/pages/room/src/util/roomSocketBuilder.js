import { constants } from "../../../_shared/constants.js";
import SocketBuilder from "../../../_shared/socketBuilder.js";

export default class RoomSocketBuilder extends SocketBuilder {
    constructor({ socketUrl, namespace }) {
        super({ socketUrl, namespace })
        this.onRoomUpdated = () => { }
        this.onUserProfileUpgrade = () => { }
    }

    setOnRoomUpdated(fn) {
        this.onRoomUpdated = fn
        return this
    }

    setOnUserProfileUpgrade(fn) {
        this.onUserProfileUpgrade = fn
        return this
    }

    build() {
        const socket = super.build()
        socket.on(constants.event.LOBBY_UPDATED, this.onRoomUpdated)
        socket.on(constants.event.UPGRADE_USER_PERMISSION, this.onUserProfileUpgrade)
        return socket
    }
}