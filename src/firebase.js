import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDM2GNo99TXLYMUwVlfXy3t8_4fl876bvY",
  authDomain: "fincoach-2.firebaseapp.com",
  projectId: "fincoach-2",
  storageBucket: "fincoach-2.firebasestorage.app",
  messagingSenderId: "1034947330310",
  appId: "1:1034947330310:web:aa655f91e0a0668aff5e87",
  measurementId: "G-R11VZWPYX6"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
