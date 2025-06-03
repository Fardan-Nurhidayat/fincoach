import Boom from '@hapi/boom';
import admin from 'firebase-admin';

export const verifyToken = async (request, h) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) throw Boom.unauthorized('Token not found');

  const token = authHeader.replace('Bearer ', '');
  const decoded = await admin.auth().verifyIdToken(token);
  request.auth = { uid: decoded.uid };
  return h.continue;
};