import firebase from "firebase";
import { firebaseConfig } from "@/../firebase.config.ts";

export const firebaseApp = firebase.initializeApp(firebaseConfig);
