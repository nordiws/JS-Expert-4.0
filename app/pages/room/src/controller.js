import { constants } from "../../_shared/constants.js"
import Attendee from "./entities/attendee.js"

export default class RoomController {
    constructor({ roomInfo, socketBuilder, view, peerBuilder, roomService }) {
        this.socketBuilder = socketBuilder
        this.roomInfo = roomInfo
        this.view = view
        this.peerBuilder = peerBuilder
        this.roomService = roomService
        this.socket = {}
    }

    static async initialize(deps) {
        return new RoomController(deps)._initialize()
    }

    async _initialize() {
        this._setupViewEvents()
        this.socket = this._setupSocket()
        this.roomService.setCurrentPeer(await this._setupWebRTC())
        this.roomService.init()
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

    async _setupWebRTC() {
        return this.peerBuilder
            .setOnError(this.onPeerError())
            .setOnConnectionOpened(this.onPeerConnectionOpened())
            .setOnCallReceived(this.onCallReceived())
            .setOnCallError(this.onCallError())
            .setOnCallClose(this.onCallClose())
            .setOnStreamReceived(this.onStreamReceived())
            .build()
    }

    onStreamReceived() {
        return (call, stream) => {
            const callerId = call.peer
            console.log('onStreamReceived', call, stream);
            const { isCurrentId } = this.roomService.addReceivedPeer(call)
            this.view.renderAudioElement({
                callerId,
                stream,
                isCurrentId
            })
        }
    }

    onCallClose() {
        return (call) => {
            console.log('onCallClose', call);
            const peerId = call.peer
            this.roomService.disconnectedPeer({ peerId })
        }
    }

    onCallError() {
        return (call, error) => {
            console.log('onCallError', call, error);
        }
    }

    onCallReceived() {
        return async (call) => {
            const stream = await this.roomService.getCurrentStream()
            console.log('answering call', stream)
            call.answer(stream)
        }
    }

    onPeerError() {
        return (error) => console.log('Peer connection error!!', error)
    }

    // quando a conexão for aberta ele pede para entrar na sala do socket
    onPeerConnectionOpened() {
        return (peer) => {
            console.log('Peer', peer)
            this.roomInfo.user.peerId = peer.id
            this.socket.emit(constants.event.JOIN_ROOM, this.roomInfo)
        }
    }

    onUserConnected() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log('User connected!', attendee)
            this.view.addAttendeeOnGrid(attendee)
            this.roomService.callNewUser(attendee)
        }
    }

    onUserDisconnected() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log(`${attendee.firstName} disconnected!`)
            this.roomService.disconnectedPeer(attendee)
            this.view.removeItemFromGrid(attendee.id)
        }
    }

    onRoomUpdated() {
        return (data) => {
            const users = data.map(item => new Attendee(item))
            this.view.updateAttendeesOnGrid(users)
            this.roomService.updateCurrentUserProfile(users)
            this.activateUserFeatures()
            console.log('room list!', users)
        }

    }

    onUserProfileUpgrade() {
        return (data) => {
            const attendee = new Attendee(data)
            console.log('onUserProfileUpgrade', attendee)
            this.roomService.upgradeUserPermission(attendee)
            if (attendee.isSpeaker) {
                this.view.addAttendeeOnGrid(attendee, true)
            }
            this.activateUserFeatures()
        }
    }

    activateUserFeatures() {
        const currentUser = this.roomService.getCurrentUser()
        this.view.showUserFeatures(currentUser.isSpeaker)
    }
}