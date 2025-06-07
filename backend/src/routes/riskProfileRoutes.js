import * as riskProfileService from '../services/riskProfileService.js';
import { verifyToken } from '../middleware/auth.js';
import path from 'path';

const routes = [
  {
    method: 'GET',
    path: '/risk-profile',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileService.getRiskProfile,
  },
  {
    method: 'POST',
    path: '/risk-profile',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileService.createRiskProfile,
  },
  {
    method: 'PUT',
    path: '/risk-profile/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileService.updateRiskProfile,
  },
  {
    method: 'DELETE',
    path: '/risk-profile/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileService.deleteRiskProfile,
  },
  {
    method: 'GET',
    path: '/risk-profile/{id}',
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: riskProfileService.getRiskProfileById,
  },
];

export default {
  name: 'riskProfileRoutes',
  register: async function (server) {
    server.route(routes);
  }
};