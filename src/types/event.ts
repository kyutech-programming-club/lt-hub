import firebase from "firebase";

type EventStatus = "private" | "unlisted" | "public";

export interface Event {
  id: string;
  title: string;
  status: EventStatus;
  createdTime: Date;
  updatedTime: Date;
}
export interface EventDoc {
  title: string;
  status: EventStatus;
  createdTime: firebase.firestore.Timestamp;
  updatedTime: firebase.firestore.Timestamp;
}

const varidateEventType = (
  data: firebase.firestore.DocumentData
): data is EventDoc => {
  if (!(data.title && typeof data.title === "string")) {
    return false;
  }
  if (
    !(
      data.createdTime &&
      data.createdTime instanceof firebase.firestore.Timestamp
    )
  ) {
    return false;
  }
  if (
    !(
      data.updatedTime &&
      data.updatedTime instanceof firebase.firestore.Timestamp
    )
  ) {
    return false;
  }
  return true;
};

export const eventConverter: firebase.firestore.FirestoreDataConverter<Event> = {
  toFirestore(event: Event): EventDoc {
    return {
      title: event.title,
      createdTime: firebase.firestore.Timestamp.fromDate(event.createdTime),
      updatedTime: firebase.firestore.Timestamp.fromDate(event.updatedTime),
    } as EventDoc;
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Event {
    const data = snapshot.data(options);

    if (!varidateEventType(data)) {
      console.error(data);
      throw new Error("Invalid data");
    }

    return {
      id: snapshot.id,
      title: data.title,
      status: data.status,
      createdTime: data.createdTime.toDate(),
      updatedTime: data.updatedTime.toDate(),
    } as Event;
  },
};
