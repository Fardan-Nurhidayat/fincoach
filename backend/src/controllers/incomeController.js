import * as incomeService from '../services/incomeService.js';

export const getAllIncomes = async (request, h) => {
  const uid = request.auth.uid;
  const incomes = await incomeService.getAllIncomes(uid);
  return h.response(incomes).code(200);
}

export const createIncome = async (request, h) => {
  const uid = request.auth.uid;
  const newIncome = await incomeService.createIncome(uid, request.payload);
  return h.response(newIncome).code(201);
};

export const updateIncome = async (request, h) => {
  const uid = request.auth.uid;
  const updatedIncome = await incomeService.updateIncome(uid, request.params.id, request.payload);
  return h.response(updatedIncome).code(200);
}

export const deleteIncome = async (request, h) => {
  const uid = request.auth.uid;
  await incomeService.deleteIncome(uid, request.params.id);
  return h.response({ message: 'Income deleted' }).code(200);
};