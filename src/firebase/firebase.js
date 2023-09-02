import { firebaseConfig } from './firebase.config.js';
import { initializeApp } from 'firebase/app';

export const firebaseApp = initializeApp(firebaseConfig);
