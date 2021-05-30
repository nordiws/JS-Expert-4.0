import { constants } from '../../_shared/constants.js'
import UserDB from '../../_shared/userDB.js'

function redirectToLobby() {
    window.location = constants.pages.lobby
}

function onLogin({ provider, firebase }) {
    return async () => {
        try {
            const result = await firebase.auth().signInWithPopup(provider)
            // The signed-in user info.
            const { user } = result
            const userData = {
                img: user.photoURL,
                username: user.displayName
            }
            UserDB.insert(userData)
            redirectToLobby()
        } catch (error) {
            alert(error)
            console.log('error', error);
        }
    }
}

const currentUser = UserDB.get()
if (Object.keys(currentUser).length) {
    redirectToLobby()
}

// Initialize Firebase
const { firebaseConfig } = constants
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const provider = new firebase.auth.GithubAuthProvider()
provider.addScope('read:user')


const btnLogin = document.getElementById('btnLogin')
btnLogin.addEventListener('click', onLogin({ provider, firebase }))