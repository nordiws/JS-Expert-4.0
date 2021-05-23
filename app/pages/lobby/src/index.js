import { constants } from "../../_shared/constants.js";
import LobbyController from "./controller.js";
import LobbySocketBuilder from "./util/lobbySocketBuilder.js";
import View from "./view.js";

const socketBuilder = new LobbySocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.lobby
})

const user = {
    img: "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
    username: "nordiws " + Date.now()
}

const dependencies = {
    socketBuilder,
    user,
    view: View
}

await LobbyController.initialize(dependencies)