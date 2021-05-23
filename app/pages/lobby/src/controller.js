export default class LobbyController {
    constructor({ socketBuilder, user, view }) {
        this.socketBuilder = socketBuilder
        this.user = user
        this.view = view
        this.socket = {}

    }

    static async initialize(deps) {
        return new LobbyController(deps)._init()
    }

    async _init() {
        this.socket = this._setupSocket()
        this._setupViewEvents()
    }

    _setupViewEvents() {
        this.view.updateUserImage(this.user)
        this.view.configureCreateRoomButton()
    }

    _setupSocket() {
        return this.socketBuilder
            .setOnLobbyUpdated(this.onLobbyUpdated())
            .build()
    }

    onLobbyUpdated() {
        return (rooms) => {
            console.log('rooms', rooms);
            this.view.updateRoomList(rooms)
        }
    }
}