import firebase from 'firebase'
import { firebaseConfig } from '@/../firebase_config.js'

export const firebaseApp = firebase.initializeApp(firebaseConfig);
