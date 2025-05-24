import { initializeApp, applicationDefault, cert }  from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export { db }
