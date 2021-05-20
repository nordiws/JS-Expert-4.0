import Attendee from "../entities/attendee.js";
import Room from "../entities/room.js";
import { constants } from "../util/constants.js";

export default class RoomsController {
    #users = new Map()

    constructor() {
        this.rooms = new Map()
    }

    onNewConnection(socket) {
        const { id } = socket
        console.log('Connection established with ', id);
        this.#updateGlobalUserData(id)
    }

    joinRoom(socket, { user, room }) {
        const userId = user.id = socket.id
        const roomId = room.id
        const updateUserData = this.#updateGlobalUserData(userId, user, roomId)
        const updatedRoom = this.#joinUserRoom(socket, updateUserData, room)
        this.#notifyUsersOnRoom(socket, roomId, updateUserData)
        this.#replyWithActiveUsers(socket, updatedRoom.users)
    }

    #replyWithActiveUsers(socket, users) {
        const event = constants.event.LOBBY_UPDATE
        socket.emit(event, [...users.values()])
    }

    #notifyUsersOnRoom(socket, roomId, user) {
        const event = constants.event.USER_CONNECTED
        socket.to(roomId).emit(event, user)
    }

    #joinUserRoom(socket, user, room) {
        const roomId = room.id
        const existingRoom = this.rooms.has(roomId)
        const currentRoom = existingRoom ? this.rooms.get(roomId) : {}
        const currentUser = new Attendee({
            ...user,
            roomId
        })

        //definir quem e o dono da sala
        const [owner, users] = existingRoom ? [currentRoom.owner, currentRoom.users] : [currentUser, new Set()]

        const updatedRoom = this.#mapRoom({
            ...currentRoom,
            ...room,
            owner,
            users: new Set([...users, ...[currentUser]])
        })

        this.rooms.set(roomId, updatedRoom)

        socket.join(roomId)

        return this.rooms.get(roomId)
    }

    #mapRoom(room) {
        const users = [...room.users.values()]
        const speakersCount = users.filter(user => user.isSpeaker).length
        const featuredAttendees = users.slice(0, 3)
        const mappedRoom = new Room({
            ...room,
            speakersCount,
            featuredAttendees,
            attendeesCount: room.users.size
        })

        return mappedRoom
    }

    #updateGlobalUserData(userId, userData = {}, roomId = '') {
        const user = this.#users.get(userId) ?? {}
        const existingRoom = this.rooms.has(roomId)
        const updateUserData = new Attendee({
            ...user,
            ...userData,
            roomId,
            isSpeaker: !existingRoom
        })
        this.#users.set(userId, updateUserData)
        return this.#users.get(userId)
    }

    getEvents() {
        const functions = Reflect.ownKeys(RoomsController.prototype)
            .filter(fn => fn !== 'constructor')
            .map(name => [name, this[name].bind(this)])
        return new Map(functions)
    }
}