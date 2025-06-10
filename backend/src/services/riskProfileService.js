import { db } from '../../firebase.js';

export const getRiskProfile = async (uid) => {
  const snapshot = await db.collection('riskProfiles').where('uid', '==', uid).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const createRiskProfile = async (uid, data) => {
  const docRef = await db.collection('riskProfiles').add({ ...data, uid });
  return { id: docRef.id, ...data, uid };
};

export const updateRiskProfile = async (uid, id, data) => {
  const riskProfileRef = db.collection('riskProfiles').doc(id);
  const riskProfileDoc = await riskProfileRef.get();

  if (!riskProfileDoc.exists || riskProfileDoc.data().uid !== uid) {
    throw new Error('Risk profile not found or does not belong to user');
  }

  await riskProfileRef.update(data);
  return { id, ...data, uid };
}

export const deleteRiskProfile = async (uid, id) => {
  const riskProfileRef = db.collection('riskProfiles').doc(id);
  const riskProfileDoc = await riskProfileRef.get();

  if (!riskProfileDoc.exists || riskProfileDoc.data().uid !== uid) {
    throw new Error('Risk profile not found or does not belong to user');
  }

  await riskProfileRef.delete();
};

export const getRiskProfileById = async (uid, id) => {
  const riskProfileRef = db.collection('riskProfiles').doc(id);
  const riskProfileDoc = await riskProfileRef.get();

  if (!riskProfileDoc.exists || riskProfileDoc.data().uid !== uid) {
    throw new Error('Risk profile not found or does not belong to user');
  }

  return { id: riskProfileDoc.id, ...riskProfileDoc.data() };
};