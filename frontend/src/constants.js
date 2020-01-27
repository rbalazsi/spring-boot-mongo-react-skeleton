/**
 * Defines global constants.
 */

export const API_VERSION = 'v1';
export const VERSIONED_JSON_MIME_TYPE = `application/vnd.email.marketing.tool-${API_VERSION}+json`;
export const ENV_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : process.env.PUBLIC_URL ;
const devPort = process.env.PORT || 3000;
export const BASE_URL = process.env.NODE_ENV === 'development' ? `http://localhost:${devPort}` : `${ENV_BASE_URL}`;
export const API_URL = `${ENV_BASE_URL}/api`;

// The key used by redux-persist for storing the state in the local storage
export const APP_PERSIST_KEY = 'skeleton_proj';
