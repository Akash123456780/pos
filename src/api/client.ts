/**
 * Centralized Production HTTP Client for NEXUS OWNER Platform
 * Handles Base URL, timeouts, headers, authentication tokens, correlation IDs,
 * automatic 401 refresh, and normalized error responses.
 */

import { TokenManager } from '../auth/TokenManager';

// Configuration from environment
export const API_BASE_URL = import.meta.env.VITE_NEXUS_API_BASE_URL || 'https://api.nexuspos.in';
export const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 10000;
export const IS_MOCK_ENABLED = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
export const APP_VERSION = '2.4.0';

// Standard API Response Contracts
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  requestId: string;
  timestamp: string;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
  requestId: string;
  timestamp: string;
}

// Custom Error Hierarchy
export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, unknown>;
  public requestId?: string;

  constructor(message: string, status = 500, code = 'API_ERROR', details?: Record<string, unknown>, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Unable to connect to NEXUS server. Please check your internet connection.', requestId?: string) {
    super(message, 0, 'NETWORK_FAILURE', undefined, requestId);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Your session has expired. Please sign in again.', requestId?: string) {
    super(message, 401, 'UNAUTHORIZED', undefined, requestId);
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends ApiError {
  constructor(message = 'You do not have permission to perform this action. Owner privilege required.', requestId?: string) {
    super(message, 403, 'FORBIDDEN', undefined, requestId);
    this.name = 'PermissionError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed for request data.', details?: Record<string, unknown>, requestId?: string) {
    super(message, 422, 'VALIDATION_ERROR', details, requestId);
    this.name = 'ValidationError';
  }
}

export class SyncError extends ApiError {
  constructor(message = 'Synchronization with POS store node failed.', details?: Record<string, unknown>) {
    super(message, 500, 'SYNC_FAILURE', details);
    this.name = 'SyncError';
  }
}

export class BarcodeError extends ApiError {
  constructor(message = 'Failed to process barcode lookup.') {
    super(message, 404, 'BARCODE_NOT_FOUND');
    this.name = 'BarcodeError';
  }
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

/**
 * Centralized HTTP Client
 */
export const httpClient = {
  /**
   * Main request method
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`);

    // Append Query Parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    // Prepare Headers
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');
    headers.set('X-Request-Id', requestId);
    headers.set('X-App-Version', APP_VERSION);
    headers.set('X-Platform', 'web');

    // Attach Bearer Token if authenticated
    if (!options.skipAuth) {
      const token = TokenManager.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Setup Timeout Controller
    const controller = new AbortController();
    const timeoutDuration = options.timeout || API_TIMEOUT_MS;
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 401 Unauthorized - Handle Token Refresh
      if (response.status === 401 && !options.skipAuth) {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
                body: JSON.stringify({ refreshToken }),
              });

              if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                const newAccess = refreshData.data?.accessToken || refreshData.accessToken;
                if (newAccess) {
                  TokenManager.setTokens(newAccess, refreshData.data?.refreshToken || refreshToken);
                  isRefreshing = false;
                  onRefreshed(newAccess);
                  // Retry original request
                  return this.request<T>(endpoint, options);
                }
              }
            } catch {
              // Refresh failed
            } finally {
              isRefreshing = false;
            }
          } else {
            // Queue duplicate requests while refresh in progress
            return new Promise((resolve, reject) => {
              subscribeTokenRefresh(() => {
                this.request<T>(endpoint, options).then(resolve).catch(reject);
              });
            });
          }
        }

        // If refresh failed or unavailable: clear and raise AuthError
        TokenManager.clearTokens();
        throw new AuthenticationError('Your session has expired. Please sign in again.', requestId);
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        throw new PermissionError('You do not have permission to perform this action. Owner privilege required.', requestId);
      }

      // Parse JSON
      let resultData: unknown;
      const text = await response.text();
      try {
        resultData = text ? JSON.parse(text) : {};
      } catch {
        resultData = { message: text };
      }

      if (!response.ok) {
        const errResp = resultData as Partial<ApiErrorResponse>;
        const errCode = errResp.error?.code || `HTTP_${response.status}`;
        const errMsg = errResp.error?.message || response.statusText || 'Request failed';
        const errDetails = errResp.error?.details;

        if (response.status === 422) {
          throw new ValidationError(errMsg, errDetails, requestId);
        }

        throw new ApiError(errMsg, response.status, errCode, errDetails, requestId);
      }

      // Return unwrapped data if wrapped in standard ApiResponse envelope
      const apiResp = resultData as ApiResponse<T>;
      if (apiResp && typeof apiResp === 'object' && apiResp.success === true && 'data' in apiResp) {
        return apiResp.data;
      }

      return resultData as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new NetworkError(`Request to ${endpoint} timed out after ${timeoutDuration}ms.`, requestId);
      }

      throw new NetworkError(`Network connection error: ${err instanceof Error ? err.message : 'Failed to fetch'}`, requestId);
    }
  },

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
