import { db } from '../../firebase.js';

export const getAllInvestments = async (uid) => {
  const snapshot = await db.collection('investments').where('uid', '==', uid).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const createInvestment = async (uid, data) => {
  const docRef = await db.collection('investments').add({ ...data, uid });
  return { id: docRef.id, ...data, uid };
};

export const updateInvestment = async (uid, id, data) => {
  const investmentRef = db.collection('investments').doc(id);
  const investmentDoc = await investmentRef.get();

  if (!investmentDoc.exists || investmentDoc.data().uid !== uid) {
    throw new Error('Investment not found or does not belong to user');
  }

  await investmentRef.update(data);
  return { id, ...data, uid };
}

export const deleteInvestment = async (uid, id) => {
  const investmentRef = db.collection('investments').doc(id);
  const investmentDoc = await investmentRef.get();

  if (!investmentDoc.exists || investmentDoc.data().uid !== uid) {
    throw new Error('Investment not found or does not belong to user');
  }

  await investmentRef.delete();
};

export const getInvestmentById = async (uid, id) => {
  const investmentRef = db.collection('investments').doc(id);
  const investmentDoc = await investmentRef.get();

  if (!investmentDoc.exists || investmentDoc.data().uid !== uid) {
    throw new Error('Investment not found or does not belong to user');
  }

  return { id: investmentDoc.id, ...investmentDoc.data() };
};