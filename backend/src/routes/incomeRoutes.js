import * as incomeCOntroller from '../controllers/incomeController.js';
import { verifyToken } from '../middleware/auth.js';

const routes = [
  {
    method: 'GET',
    path: '/income',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: incomeCOntroller.getAllIncomes,
  },
  {
    method: 'POST',
    path: '/income',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: incomeCOntroller.createIncome,
  },
  {
    method: 'PUT',
    path: '/income/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: incomeCOntroller.updateIncome,
  },
  {
    method: 'DELETE',
    path: '/income/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: incomeCOntroller.deleteIncome,
  },
];

export default {
  name: 'incomeRoutes',
  register: async function (server) {
    server.route(routes);
  },
};