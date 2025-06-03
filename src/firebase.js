import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAbmAu7wP2PmpmlH3q4txMIOfRVau4vUfM",
  authDomain: "fincoach-3d293.firebaseapp.com",
  projectId: "fincoach-3d293",
  storageBucket: "fincoach-3d293.firebasestorage.app",
  messagingSenderId: "901394584358",
  appId: "1:901394584358:web:b4fd20cc72c7d1b53e67e7",
  measurementId: "G-8LR4WN31LT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
