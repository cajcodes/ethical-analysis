import axios from 'axios';

const api = axios.create({
  baseURL: 'my-ethics-app.vercel.app',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
});

export const analyzeDilemma = async (dilemma: string) => {
  const url = `/api/analysis`;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  const payload = { situation: dilemma };

  try {
    const response = await axios.post(url, payload, { headers });
    return response;
  } catch (error) {
    throw error;
  }
};

export const evaluateStep = async (prompt: string, completion: string, rubric: string): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const response = await axios.post(`/api/eval`, { prompt, completion, rubric }, { headers });
    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getPrompts = async (): Promise<string[]> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  const response = await axios.get(`/api/steps`, { headers });
  return response.data;
};
