import { firebaseApp } from '@/firebase/firebase.js';
import { getFirestore } from 'firebase/firestore';

export const db = getFirestore(firebaseApp);
