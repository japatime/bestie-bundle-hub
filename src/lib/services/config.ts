
/**
 * Configuration for API services
 */

/**
 * Base URL for API requests 
 */
export const API_BASE_URL = 'https://www.airtimenigeria.com/api/v1';

// The API token should ideally be stored in a backend service
// Using the token provided by the user
export const API_TOKEN = '922|6Tydbi6ek1BB9JeNDhWXxyz9kz4L7iFXJ3f6vBGQ';

/**
 * Interface for API responses
 */
export interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  details?: any;
  data?: any;
}

/**
 * Common headers for API requests
 */
export const getApiHeaders = () => ({
  'Authorization': `Bearer ${API_TOKEN}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
});
