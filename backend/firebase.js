import { initializeApp, cert } from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();
const serviceAccountBase64 = process.env.SERVICE_ACCOUNT_KEY;
const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { db };
