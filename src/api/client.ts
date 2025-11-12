import axios, { AxiosInstance, AxiosError } from 'axios';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_URL = USE_MOCK
  ? (import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3001')
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Usar mockService diretamente quando USE_MOCK=true
if (USE_MOCK) {
  console.log('🔧 Mock mode enabled - Using mock service');

  // Usar mockService para todas as requisições quando USE_MOCK está ativo
  const { mockService } = await import('./mockService');

  // Interceptar requisições para usar mock
  apiClient.interceptors.request.use(async (config) => {
    if (USE_MOCK) {
      console.log('🎯 Mock request:', config.method?.toUpperCase(), config.url);

      try {
        const result = await mockService.request({
          method: config.method?.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE',
          url: config.url!,
          data: config.data,
          ...config
        });
        console.log('✅ Mock response for', config.url, ':', Array.isArray(result) ? `Array[${result.length}]` : typeof result);

        // Retornar resposta mockada no formato do Axios
        return {
          ...config,
          adapter: () => Promise.resolve({
            data: result,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          }),
        };
      } catch (error) {
        console.error('❌ Mock error for', config.url, ':', error);
        throw error;
      }
    }
    return config;
  });
}

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      // Access denied - handled by error interceptor
    }

    return Promise.reject(error);
  }
);

if (USE_MOCK) {
  localStorage.setItem('authToken', 'mock-token-123');
}

export default apiClient;

