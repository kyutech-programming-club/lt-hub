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
  async login(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebaseApp.auth().signInWithPopup(provider);
  },
  async logout(): Promise<void> {
    await firebaseApp.auth().signOut();
  },
};
