import admin from 'firebase-admin';

export const register = async (email, password, displayName) => {
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName,
  });

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    displayName: userRecord.displayName,
  };
};