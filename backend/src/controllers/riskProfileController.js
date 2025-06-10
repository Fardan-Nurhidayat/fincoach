import * as riskProfileService from '../services/riskProfileService.js';

export const getRiskProfile = async (request, h) => {
  try {
    const uid = request.auth.uid;
    const riskProfile = await riskProfileService.getRiskProfile(uid);
    return h.response(riskProfile).code(200);
  } catch (error) {
    console.error("Error fetching risk profile:", error);
    return h.response({ error: "Failed to fetch risk profile" }).code(500);
  }
}

export const createRiskProfile = async (request, h) => {
  try {
    const uid = request.auth.uid;
    const newRiskProfile = await riskProfileService.createRiskProfile(uid, request.payload);
    return h.response(newRiskProfile).code(201);
  } catch (error) {
    console.error("Error creating risk profile:", error);
    return h.response({ error: "Failed to create risk profile" }).code(500);
  }
};

export const updateRiskProfile = async (request, h) => {
  try {
    const uid = request.auth.uid;
    const updatedRiskProfile = await riskProfileService.updateRiskProfile(
      uid,
      request.params.id,
      request.payload
    );
    return h.response(updatedRiskProfile).code(200);
  } catch (error) {
    console.error("Error updating risk profile:", error);
    return h.response({ error: "Failed to update risk profile" }).code(500);
  }
}

export const deleteRiskProfile = async (request, h) => {
  try {
    const uid = request.auth.uid;
    await riskProfileService.deleteRiskProfile(uid, request.params.id);
    return h.response({ message: "Risk profile deleted" }).code(200);
  } catch (error) {
    console.error("Error deleting risk profile:", error);
    return h.response({ error: "Failed to delete risk profile" }).code(500);
  }
};

export const getRiskProfileById = async (request, h) => {
  try {
    const uid = request.auth.uid;
    const riskProfile = await riskProfileService.getRiskProfileById(uid, request.params.id);
    return h.response(riskProfile).code(200);
  } catch (error) {
    console.error("Error fetching risk profile by ID:", error);
    return h.response({ error: "Failed to fetch risk profile by ID" }).code(500);
  }
};