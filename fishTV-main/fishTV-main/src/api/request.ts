import { API_CONFIG } from './config';
import { ApiResponse } from './types';

const request = async <T>(endpoint: string, params: Record<string, any> = {}, baseURL?: string): Promise<ApiResponse<T>> => {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryString.append(key, String(value));
    }
  });

  const source = (baseURL || API_CONFIG.baseURL).match(/^\/(\w+)/)
  const sourceName = source ? source[1] : 'ikun'
  const url = `/api/video/proxy?source=${sourceName}&${queryString.toString()}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data as ApiResponse<T>;
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default request;
