import { db } from '../../firebase.js';

export const getAllUsers = async () => {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createUser = async (data) => {
  const doc = await db.collection('users').add(data);
  return { id: doc.id, ...data };
};

export const updateUser = async (id, data) => {
  await db.collection('users').doc(id).update(data);
  return { id, ...data };
};

export const deleteUser = async (id) => {
  await db.collection('users').doc(id).delete();
};