import { constants } from "../util/constants.js";

export default class LobbyController {
    constructor({ activeRooms, roomListener }) {
        this.activeRooms = activeRooms
        this.roomListener = roomListener
    }

    onNewConnection(socket) {
        const { id } = socket
        console.log('Lobby connection established with ', id);
        this.#updateLobbyRooms(socket, [...this.activeRooms.values()])
    }

    #updateLobbyRooms(socket, activeRooms) {
        socket.emit(constants.event.LOBBY_UPDATED, activeRooms)
    }

    getEvents() {
        const functions = Reflect.ownKeys(LobbyController.prototype)
            .filter(fn => fn !== 'constructor')
            .map(name => [name, this[name].bind(this)])
        return new Map(functions)
    }
}