export const constants = {
    socketUrl: 'http://localhost:3000',
    socketNamespaces: {
        room: 'room',
        lobby: 'lobby'
    },
    peerConfig: Object.values({
        id: undefined
    }),
    pages: {
        lobby: '/pages/lobby',
        login: '/pages/login'
    },
    event: {
        USER_CONNECTED: 'userConnection',
        USER_DISCONNECTED: 'userDisconnection',
        JOIN_ROOM: 'joinRoom',
        LOBBY_UPDATED: 'lobbyUpdate',
        UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
        SPEAK_REQUEST: 'speakRequest',
        SPEAK_ANSWER: 'speakAnswer'
    },
    firebaseConfig: {
        apiKey: "AIzaSyBS9IEEfNHwlgHtc3ezlZHFYS5l-IihXP4",
        authDomain: "js-expert-4.firebaseapp.com",
        projectId: "js-expert-4",
        storageBucket: "js-expert-4.appspot.com",
        messagingSenderId: "241920341694",
        appId: "1:241920341694:web:c04daceb6d2b4d7c6ed0ef",
        measurementId: "G-GR70NSVZ3Q"
    },
    storageKey: 'jsexpert:storage:user'
}