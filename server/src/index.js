import RoomsController from "./controllers/roomsController.js";
import LobbyController from "./controllers/lobbyController.js";
import SocketServer from "./util/socket.js";
import { constants } from "./util/constants.js";
import Event from 'events'

const port = process.env.PORT || 3000
const socketServer = new SocketServer({ port })
const server = await socketServer.start()

const roomsPubSub = new Event()

const roomsController = new RoomsController()
const lobbyController = new LobbyController({
    activeRooms: roomsController.rooms,
    roomsListener: roomsPubSub
})

const namespaces = {
    room: { controller: roomsController, eventEmitter: new Event() },
    lobby: { controller: lobbyController, eventEmitter: roomsPubSub },
}

const routeConfig = Object.entries(namespaces)
    .map(([namespaces, { controller, eventEmitter }]) => {
        const controllerEvents = controller.getEvents()
        eventEmitter.on(
            constants.event.USER_CONNECTED,
            controller.onNewConnection.bind(controller)
        )
        return {
            [namespaces]: { events: controllerEvents, eventEmitter }
        }
    })

socketServer.attachEvents({ routeConfig })

console.log(`Socket server is running at ${server.address().port}`);