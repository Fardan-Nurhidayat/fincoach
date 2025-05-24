import * as UserService from '../services/userService.js';
import admin from 'firebase-admin';

export const getUsers = async () => await UserService.getAllUsers();

export const createUser = async (request, h) => {
  const newUser = await UserService.createUser(request.payload);
  return h.response(newUser).code(201);
};

export const updateUser = async (request, h) => {
  const updated = await UserService.updateUser(request.params.id, request.payload);
  return h.response(updated).code(200);
};

export const deleteUser = async (request, h) => {
  await UserService.deleteUser(request.params.id);
  return h.response({ message: "User deleted" }).code(200);
};

export const getUserByUid = async (request, h) => {
  const uid = request.auth.uid;

  try {
    const userRecord = await admin.auth().getUser(uid);
    return h.response({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
    });
  } catch (error) {
    return h.response({ error: 'User not found' }).code(404);
  }
};  