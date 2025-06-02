import axiosClient from './axiosClient';
import { AIModel } from '../types';

const API_URL = '/api/ai-models/'; // Base URL for AI models endpoint

/**
 * Fetches all AI models from the backend.
 */
export const getAIModels = async (): Promise<AIModel[]> => {
  const response = await axiosClient.get<AIModel[]>(API_URL);
  return response.data;
};

/**
 * Creates a new AI model.
 * @param data - The data for the new AI model, excluding the id.
 */
export const createAIModel = async (data: Omit<AIModel, 'id'>): Promise<AIModel> => {
  const response = await axiosClient.post<AIModel>(API_URL, data);
  return response.data;
};

/**
 * Updates an existing AI model.
 * @param id - The ID of the AI model to update.
 * @param data - The partial data to update the AI model with.
 */
export const updateAIModel = async (id: number, data: Partial<Omit<AIModel, 'id'>>): Promise<AIModel> => {
  const response = await axiosClient.put<AIModel>(`${API_URL}${id}/`, data);
  return response.data;
};

/**
 * Deletes an AI model.
 * @param id - The ID of the AI model to delete.
 */
export const deleteAIModel = async (id: number): Promise<void> => {
  await axiosClient.delete(`${API_URL}${id}/`);
};
