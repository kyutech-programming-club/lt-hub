import { db } from "@/firebase/firestore";
import { User, userConverter } from "@/types/user";

export default {
  async userExists(id: string): Promise<boolean> {
    const doc = await db
      .collection("users")
      .withConverter(userConverter)
      .doc(id)
      .get();
    return doc.exists;
  },

  async getUserData(id: string): Promise<User> {
    try {
      const doc = await db
        .collection("users")
        .withConverter(userConverter)
        .doc(id)
        .get();
      return doc.data() as User;
    } catch (e) {
      // TODO:Inform error to user by moving to 500 page or showing something like a dialog
      throw new Error(e);
    }
  },

  async createUser(user: firebase.User): Promise<void> {
    try {
      await db
        .collection("users")
        .withConverter(userConverter)
        .doc(user.uid)
        .set({
          name: user.displayName || "ななっしー",
          belong: "none",
          photoUrl: user.photoURL,
          createdTime: new Date(),
          updatedTime: new Date(),
        } as User);
    } catch (e) {
      console.dir(e);
    }
  },
};
