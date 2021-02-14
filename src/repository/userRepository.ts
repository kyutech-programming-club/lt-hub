import { db } from "@/firebase/firestore";
import { Auth } from "@/firebase/auth";
import { User, userConverter } from "@/types/user";

export async function getUserData(): Promise<User | undefined> {
  try {
    const doc = await db
      .collection("users")
      .withConverter(userConverter)
      .doc(Auth.currentUid())
      .get();
    return doc.data() as User;
  } catch (e) {
    console.dir(e);
  }
}
