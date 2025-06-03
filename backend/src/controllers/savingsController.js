import * as savingsService from '../services/savingsService.js';

export const getAllSavings = async (request, h) => {
  const uid = request.auth.uid;
  const savings = await savingsService.getAllSavings(uid);
  return h.response(savings).code(200);
}

export const createSavings = async (request, h) => {
  const uid = request.auth.uid;
  const newSavings = await savingsService.createSavings(uid, request.payload);
  return h.response(newSavings).code(201);
};

export const updateSavings = async (request, h) => {
  const uid = request.auth.uid;
  const updatedSavings = await savingsService.updateSavings(uid, request.params.id, request.payload);
  return h.response(updatedSavings).code(200);
}

export const deleteSavings = async (request, h) => {
  const uid = request.auth.uid;
  await savingsService.deleteSavings(uid, request.params.id);
  return h.response({ message: 'Savings deleted' }).code(200);
};

export const getSavingsById = async (request, h) => {
  const uid = request.auth.uid;
  const savings = await savingsService.getSavingsById(uid, request.params.id);
  return h.response(savings).code(200);
};