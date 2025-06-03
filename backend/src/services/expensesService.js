import { db } from '../../firebase.js';

export const getAllExpenses = async (uid) => {
  const snapshot = await db.collection('expenses').where('uid', '==', uid).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const createExpense = async (uid, data) => {
  const docRef = await db.collection('expenses').add({ ...data, uid });
  return { id: docRef.id, ...data, uid };
};

export const updateExpense = async (uid, id, data) => {
  const expenseRef = db.collection('expenses').doc(id);
  const expenseDoc = await expenseRef.get();

  if (!expenseDoc.exists || expenseDoc.data().uid !== uid) {
    throw new Error('Expense not found or does not belong to user');
  }

  await expenseRef.update(data);
  return { id, ...data, uid };
}

export const deleteExpense = async (uid, id) => {
  const expenseRef = db.collection('expenses').doc(id);
  const expenseDoc = await expenseRef.get();

  if (!expenseDoc.exists || expenseDoc.data().uid !== uid) {
    throw new Error('Expense not found or does not belong to user');
  }

  await expenseRef.delete();
};

export const getExpenseById = async (uid, id) => {
  const expenseRef = db.collection('expenses').doc(id);
  const expenseDoc = await expenseRef.get();

  if (!expenseDoc.exists || expenseDoc.data().uid !== uid) {
    throw new Error('Expense not found or does not belong to user');
  }

  return { id: expenseDoc.id, ...expenseDoc.data() };
};