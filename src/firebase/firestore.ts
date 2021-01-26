import { firebaseApp } from "@/firebase/firebase.ts";

firebaseApp.firestore().settings({
  ignoreUndefinedProperties: true,
});
export const db = firebaseApp.firestore();
