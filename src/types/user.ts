interface User {
  id: string;
  data: firebase.firestore.DocumentData | undefined;
}

export default User;
