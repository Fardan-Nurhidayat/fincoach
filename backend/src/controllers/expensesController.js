import * as expensesService from '../services/expensesService.js';

export const getAllExpenses = async (request, h) => {
  const uid = request.auth.uid;
  const expenses = await expensesService.getAllExpenses(uid);
  return h.response(expenses).code(200);
}

export const createExpense = async (request, h) => {
  const uid = request.auth.uid;
  const newExpense = await expensesService.createExpense(uid, request.payload);
  return h.response(newExpense).code(201);
};

export const updateExpense = async (request, h) => {
  const uid = request.auth.uid;
  const updatedExpense = await expensesService.updateExpense(uid, request.params.id, request.payload);
  return h.response(updatedExpense).code(200);
}

export const deleteExpense = async (request, h) => {
  const uid = request.auth.uid;
  await expensesService.deleteExpense(uid, request.params.id);
  return h.response({ message: 'Expense deleted' }).code(200);
};

export const getExpenseById = async (request, h) => {
  const uid = request.auth.uid;
  const expense = await expensesService.getExpenseById(uid, request.params.id);
  return h.response(expense).code(200);
};