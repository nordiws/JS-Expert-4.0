import { constants } from "../../_shared/constants.js"
import Attendee from "./entities/attendee.js"

export default class RoomController {
    constructor({ roomInfo, socketBuilder, view }) {
        this.socketBuilder = socketBuilder
        this.roomInfo = roomInfo
        this.socket = {}
        this.view = view
    }

    static async initialize(deps) {
        return new RoomController(deps)._initialize()
    }

    async _initialize() {
        this._setupViewEvents()
        this.socket = this._setupSocket()
        this.socket.emit(constants.event.JOIN_ROOM, this.roomInfo)
    }

    _setupViewEvents() {
        this.view.updateUserImage(this.roomInfo.user)
        this.view.updateRoomTopic(this.roomInfo.room)
    }

    _setupSocket() {
        return this.socketBuilder
            .setOnUserConnected(this.onUserConnected())
            .setOnUserDisconnected(this.onUserDisconnected())
            .setOnRoomUpdated(this.onRoomUpdated())
            .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
            .build()
    }

    onUserConnected() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log('User connected!', attendee)
            this.view.addAttendeeOnGrid(attendee)
        }
    }

    onUserDisconnected() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log(`${attendee.firstName} disconnected!`)
            this.view.removeItemFromGrid(attendee.id)
        }
    }

    onRoomUpdated() {
        return (room) => {
            console.log('room list!', room)
            this.view.updateAttendeesOnGrid(room)
        }

    }

    onUserProfileUpgrade() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log('onUserProfileUpgrade', attendee)
            if (attendee.isSpeaker) {
                this.view.addAttendeeOnGrid(attendee, true)
            }
        }
    }
}