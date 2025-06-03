import * as investmentsService from '../services/investmentsService.js';

export const getAllInvestments = async (request, h) => {
  const uid = request.auth.uid;
  const investments = await investmentsService.getAllInvestments(uid);
  return h.response(investments).code(200);
}

export const createInvestment = async (request, h) => {
  const uid = request.auth.uid;
  const newInvestment = await investmentsService.createInvestment(uid, request.payload);
  return h.response(newInvestment).code(201);
};

export const updateInvestment = async (request, h) => {
  const uid = request.auth.uid;
  const updatedInvestment = await investmentsService.updateInvestment(uid, request.params.id, request.payload);
  return h.response(updatedInvestment).code(200);
}

export const deleteInvestment = async (request, h) => {
  const uid = request.auth.uid;
  await investmentsService.deleteInvestment(uid, request.params.id);
  return h.response({ message: 'Investment deleted' }).code(200);
};

export const getInvestmentById = async (request, h) => {
  const uid = request.auth.uid;
  const investment = await investmentsService.getInvestmentById(uid, request.params.id);
  return h.response(investment).code(200);
};