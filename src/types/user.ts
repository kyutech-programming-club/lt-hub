import firebase from "firebase";

export interface User {
  id: string;
  name: string;
  belong: string;
  photoUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  createdTime: Date;
  updatedTime: Date;
}
export interface UserDoc {
  name: string;
  belong: string;
  photoUrl: string;
  twitterUrl?: string;
  githubUrl?: string;
  createdTime: firebase.firestore.Timestamp;
  updatedTime: firebase.firestore.Timestamp;
}

export const userConverter: firebase.firestore.FirestoreDataConverter<User> = {
  toFirestore(user: User): UserDoc {
    return {
      name: user.name,
      belong: user.belong,
      photoUrl: user.photoUrl,
      twitterUrl: user.twitterUrl,
      githubUrl: user.githubUrl,
      createdTime: firebase.firestore.Timestamp.fromDate(user.createdTime),
      updatedTime: firebase.firestore.Timestamp.fromDate(user.updatedTime),
    } as UserDoc;
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      belong: data.belong,
      photoUrl: data.photoUrl,
      twitterUrl: data.twitterUrl,
      githubUrl: data.githubUrl,
      createdTime: data.createdTime.toDate(),
      updatedTime: data.updatedTime.toDate(),
    } as User;
  },
};
