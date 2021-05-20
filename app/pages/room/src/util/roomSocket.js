import { constants } from "../../../_shared/constants.js";
import SocketBuilder from "../../../_shared/socketBuilder.js";

export default class RoomSocketBuilder extends SocketBuilder {
    constructor({ socketUrl, namespace }) {
        super({ socketUrl, namespace })
        this.onRoomUpdate = () => { }
    }

    setOnRoomUpdated(fn) {
        this.onRoomUpdate = fn
        return this
    }

    build() {
        const socket = super.build()
        socket.on(constants.event.LOBBY_UPDATED, this.onRoomUpdate)
        return socket
    }
}