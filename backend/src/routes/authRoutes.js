import * as AuthController from '../controllers/authController.js';

const routes = [
  { method: 'POST', path: '/auth/register', handler: AuthController.register }
];

export default {
  name: 'authRoutes',
  register: async function (server) {
    server.route(routes);
  }
};