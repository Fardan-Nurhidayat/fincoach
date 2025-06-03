import * as AuthService from '../services/authService.js';

export const register = async (request, h) => {
  const { email, password, displayName } = request.payload;
  const user = await AuthService.register(email, password, displayName);

  if(!user) {
    return h.response({ error: 'User registration failed' }).code(400);
  }
  return h.response(user).code(201);
};