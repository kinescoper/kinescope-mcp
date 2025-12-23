/**
 * Kinescope API Client
 * 
 * Базовый HTTP клиент для работы с Kinescope API
 * На основе документации: https://documenter.getpostman.com/view/10589901/TVCcXpNM
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface KinescopeClientOptions {
  apiKey: string;
  baseURL?: string;
  apiVersion?: 'v1' | 'v2';
}

export class KinescopeClient {
  private client: AxiosInstance;
  public apiKey: string; // Публичное для доступа из инструментов
  private baseURL: string;

  constructor(options: KinescopeClientOptions) {
    if (!options.apiKey || options.apiKey.trim() === '') {
      throw new Error('Kinescope API key is required. Provide it via KINESCOPE_API_KEY environment variable or --api-key flag.');
    }
    
    this.apiKey = options.apiKey.trim();
    
    // Определяем базовый URL в зависимости от версии API
    if (options.baseURL) {
      this.baseURL = options.baseURL;
    } else if (options.apiVersion === 'v2') {
      this.baseURL = 'https://api.kinescope.io/v2';
    } else {
      this.baseURL = 'https://api.kinescope.io/v1'; // По умолчанию v1
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-API-Token': this.apiKey, // Also send as X-API-Token header (Kinescope API accepts both)
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Получить базовый URL клиента
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Выполняет HTTP запрос к Kinescope API
   */
  async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.request<T>({
        method,
        url: path,
        data,
        ...config,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        // Provide helpful error message for authentication issues
        if (status === 401 || (errorData && errorData.message && errorData.message.includes('api_token'))) {
          throw new Error(
            `Authentication failed: API token is required. ` +
            `Please ensure KINESCOPE_API_KEY environment variable is set correctly in your MCP configuration. ` +
            `API Error: ${status} - ${JSON.stringify(errorData)}`
          );
        }
        
        throw new Error(
          `Kinescope API Error: ${status} - ${JSON.stringify(errorData)}`
        );
      }
      throw error;
    }
  }

  /**
   * GET запрос
   */
  async get<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('GET', path, undefined, config);
  }

  /**
   * POST запрос
   */
  async post<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('POST', path, data, config);
  }

  /**
   * PUT запрос
   */
  async put<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('PUT', path, data, config);
  }

  /**
   * DELETE запрос
   */
  async delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('DELETE', path, undefined, config);
  }

  /**
   * PATCH запрос
   */
  async patch<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('PATCH', path, data, config);
  }
}

