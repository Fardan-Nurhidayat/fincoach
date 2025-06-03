import { db } from '../../firebase.js';

export const getAllIncomes = async (uid) => {
  const snapshot = await db.collection('incomes').where('uid', '==', uid).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const createIncome = async (uid, data) => {
  const docRef = await db.collection('incomes').add({ ...data, uid });
  return { id: docRef.id, ...data, uid };
};

export const updateIncome = async (uid, id, data) => {
  const incomeRef = db.collection('incomes').doc(id);
  const incomeDoc = await incomeRef.get();

  if (!incomeDoc.exists || incomeDoc.data().uid !== uid) {
    throw new Error('Income not found or does not belong to user');
  }

  await incomeRef.update(data);
  return { id, ...data, uid };
}

export const deleteIncome = async (uid, id) => {
  const incomeRef = db.collection('incomes').doc(id);
  const incomeDoc = await incomeRef.get();

  if (!incomeDoc.exists || incomeDoc.data().uid !== uid) {
    throw new Error('Income not found or does not belong to user');
  }

  await incomeRef.delete();
};

export const getIncomeById = async (uid, id) => {
  const incomeRef = db.collection('incomes').doc(id);
  const incomeDoc = await incomeRef.get();

  if (!incomeDoc.exists || incomeDoc.data().uid !== uid) {
    throw new Error('Income not found or does not belong to user');
  }

  return { id: incomeDoc.id, ...incomeDoc.data() };
};