import firebase from 'firebase/app'
import 'firebase/storage'
import config from './firebase-config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase.storage()
