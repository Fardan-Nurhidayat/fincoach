import admin from 'firebase-admin';

export const register = async (email, password, displayName) => {
  try {
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
  } catch (error) {
    return null; // Registration failed
  }
};