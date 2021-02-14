import firebase from "firebase";
import { firebaseApp } from "@/firebase/firebase.ts";

firebaseApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
export const Auth = {
  currentUid(): string {
    const currentUser = firebaseApp.auth().currentUser;
    if (currentUser == null) {
      return "";
    }
    return currentUser.uid;
  },
  login(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebaseApp.auth().signInWithPopup(provider);
  },
  logout(): void {
    firebaseApp.auth().signOut();
  },
};
