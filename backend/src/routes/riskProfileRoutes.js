import * as riskProfileController from '../controllers/riskProfileController.js';
import { verifyToken } from '../middleware/auth.js';

const routes = [
  {
    method: 'GET',
    path: '/risk-profile',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileController.getRiskProfile,
  },
  {
    method: 'POST',
    path: '/risk-profile',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileController.createRiskProfile,
  },
  {
    method: 'PUT',
    path: '/risk-profile/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileController.updateRiskProfile,
  },
  {
    method: 'DELETE',
    path: '/risk-profile/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileController.deleteRiskProfile,
  },
  {
    method: 'GET',
    path: '/risk-profile/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileController.getRiskProfileById,
  },
];

export default {
  name: 'riskProfileRoutes',
  register: async function (server) {
    server.route(routes);
  }
};