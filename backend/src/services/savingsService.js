import { db } from '../../firebase.js';

export const getAllSavings = async (uid) => {
  const snapshot = await db.collection('savings').where('uid', '==', uid).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const createSavings = async (uid, data) => {
  const docRef = await db.collection('savings').add({ ...data, uid });
  return { id: docRef.id, ...data, uid };
};

export const updateSavings = async (uid, id, data) => {
  const savingsRef = db.collection('savings').doc(id);
  const savingsDoc = await savingsRef.get();

  if (!savingsDoc.exists || savingsDoc.data().uid !== uid) {
    throw new Error('Savings not found or does not belong to user');
  }

  await savingsRef.update(data);
  return { id, ...data, uid };
}

export const deleteSavings = async (uid, id) => {
  const savingsRef = db.collection('savings').doc(id);
  const savingsDoc = await savingsRef.get();

  if (!savingsDoc.exists || savingsDoc.data().uid !== uid) {
    throw new Error('Savings not found or does not belong to user');
  }

  await savingsRef.delete();
};

export const getSavingsById = async (uid, id) => {
  const savingsRef = db.collection('savings').doc(id);
  const savingsDoc = await savingsRef.get();

  if (!savingsDoc.exists || savingsDoc.data().uid !== uid) {
    throw new Error('Savings not found or does not belong to user');
  }

  return { id: savingsDoc.id, ...savingsDoc.data() };
};