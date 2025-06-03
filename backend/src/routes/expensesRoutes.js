import * as expensesController from '../controllers/expensesController.js';
import { verifyToken } from '../middleware/auth.js';

const routes = [
  {
    method: 'GET',
    path: '/expenses',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: expensesController.getAllExpenses,
  },
  {
    method: 'POST',
    path: '/expenses',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: expensesController.createExpense,
  },
  {
    method: 'PUT',
    path: '/expenses/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: expensesController.updateExpense,
  },
  {
    method: 'DELETE',
    path: '/expenses/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: expensesController.deleteExpense,
  },
  {
    method: 'GET',
    path: '/expenses/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: expensesController.getExpenseById,
  },
];

export default {
  name: 'expensesRoutes',
  register: async function (server) {
    server.route(routes);
  },
};