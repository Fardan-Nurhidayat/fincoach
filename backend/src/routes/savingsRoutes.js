import * as savingsController from '../controllers/savingsController.js';
import { verifyToken } from '../middleware/auth.js';

const routes = [
  {
    method: 'GET',
    path: '/savings',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: savingsController.getAllSavings,
  },
  {
    method: 'POST',
    path: '/savings',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: savingsController.createSavings,
  },
  {
    method: 'PUT',
    path: '/savings/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: savingsController.updateSavings,
  },
  {
    method: 'DELETE',
    path: '/savings/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: savingsController.deleteSavings,
  },
  {
    method: 'GET',
    path: '/savings/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: savingsController.getSavingsById,
  },
];

export default {
  name: 'savingsRoutes',
  register: async function (server) {
    server.route(routes);
  },
};