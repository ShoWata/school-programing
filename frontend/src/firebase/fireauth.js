import firebase from 'firebase/app'
import 'firebase/auth'
import config from './firebase-config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

export default firebase.auth()
