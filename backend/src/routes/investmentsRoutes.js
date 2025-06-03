import * as investmentsController from '../controllers/investmentsController.js';
import { verifyToken } from '../middleware/auth.js';

const routes = [
  {
    method: 'GET',
    path: '/investments',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: investmentsController.getAllInvestments,
  },
  {
    method: 'POST',
    path: '/investments',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: investmentsController.createInvestment,
  },
  {
    method: 'PUT',
    path: '/investments/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: investmentsController.updateInvestment,
  },
  {
    method: 'DELETE',
    path: '/investments/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: investmentsController.deleteInvestment,
  },
  {
    method: 'GET',
    path: '/investments/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: investmentsController.getInvestmentById,
  },
  // {
  //   method: 'GET',
  //   path: '/investments/portfolio',
  //   options: {
  //     pre: [{ method: verifyToken }],
  //   },
  //   handler: investmentsController.getInvestmentPortfolio,
  // },
  // {
  //   method: 'GET',
  //   pah: '/investments/portfolio/{id}',
  //   options: {
  //     pre: [{ method: verifyToken }],
  //   },
  //   handler: investmentsController.getInvestmentPortfolioById,
  // },
];

export default {
  name: 'investmentsRoutes',
    register: async function (server) {
    server.route(routes);
  },
}