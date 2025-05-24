import * as AuthService from '../services/authService.js';

export const register = async (request, h) => {
  const { email, password, displayName } = request.payload;
  const user = await AuthService.register(email, password, displayName);
  return h.response(user).code(201);
};