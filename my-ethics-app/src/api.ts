// src/api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

// src/api.ts
export const analyzeDilemma = async (dilemma: string) => {
  const url = `${API_URL}/analysis`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const payload = { situation: dilemma };

  // console.log(`Request URL: ${url}`);
  // console.log(`Request Headers: ${JSON.stringify(headers)}`);
  // console.log(`Request Payload: ${JSON.stringify(payload)}`);

  try {
    const response = await axios.post(url, payload, { headers });
    // console.log(response.data); // Log the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const evaluateStep = async (prompt: string, completion: string, rubric: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/eval`, { prompt, completion, rubric });
    // console.log('API Response Data:', response.data);
    return response.data.response;
  } catch (error) {
    // console.error('Error evaluating step:', error);
    throw error;
  }
};

export const getPrompts = async (): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/api/steps`);
  return response.data;
};
