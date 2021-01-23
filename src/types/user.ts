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

const varidateUserType = (data: any): data is UserDoc => {
  // if (!(data.id && typeof data.id === "string")) {
  //   return false;
  // }
  // if (!(data.name && typeof data.name === "string")) {
  //   return false;
  // }
  // if (!(data.belong && typeof data.belong === "string")) {
  //   return false;
  // }
  // if (
  //   !(
  //     data.createdTime &&
  //     data.createdTime instanceof firebase.firestore.Timestamp
  //   )
  // ) {
  //   return false;
  // }
  // if (
  //   !(
  //     data.updatedTime &&
  //     data.updatedTime instanceof firebase.firestore.Timestamp
  //   )
  // ) {
  //   return false;
  // }
  // return true;
  return data !== undefined;
};

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

    if (!varidateUserType(data)) {
      console.error(data);
      throw new Error("Invalid data");
    }

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
