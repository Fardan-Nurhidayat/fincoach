import * as incomeService from "../services/incomeService.js";

export const getAllIncomes = async (request, h) => {
  try {
    const uid = request.auth.uid;
    const incomes = await incomeService.getAllIncomes(uid);
    return h.response(incomes).code(200);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return h.response({ error: "Failed to fetch incomes" }).code(500);
  }
};

export const createIncome = async (request, h) => {
  try {
    const uid = request.auth.uid;
    const newIncome = await incomeService.createIncome(uid, request.payload);
    return h.response(newIncome).code(201);
  } catch (error) {
    console.error("Error creating income:", error);
    return h.response({ error: "Failed to create income" }).code(500);
  }
};

export const updateIncome = async (request, h) => {
  const uid = request.auth.uid;
  const updatedIncome = await incomeService.updateIncome(
    uid,
    request.params.id,
    request.payload
  );
  return h.response(updatedIncome).code(200);
};

export const deleteIncome = async (request, h) => {
  const uid = request.auth.uid;
  await incomeService.deleteIncome(uid, request.params.id);
  return h.response({ message: "Income deleted" }).code(200);
};

export const getIncomeById = async (request, h) => {
  const uid = request.auth.uid;
  const income = await incomeService.getIncomeById(uid, request.params.id);
  return h.response(income).code(200);
};
