import { db } from "@/firebase/firestore";
import { Event, eventConverter } from "@/types/event";
import { User } from "@/types/user";

export async function getEventList(user: User): Promise<Array<Event>> {
  try {
    if (user.belong === "proken") {
      const collection = await db
        .collection("events")
        .withConverter(eventConverter)
        .get();
      return collection.docs.map((doc) => doc.data() as Event);
    } else {
      const collection = await db
        .collection("events")
        .withConverter(eventConverter)
        .where("status", "==", "public")
        .get();
      return collection.docs.map((doc) => doc.data() as Event);
    }
  } catch (e) {
    // TODO:Inform error to user by moving to 500 page or showing something like a dialog
    throw new Error(e);
  }
}
