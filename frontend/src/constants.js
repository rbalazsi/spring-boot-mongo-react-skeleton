/**
 * Defines global constants.
 */

export const ENV_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : process.env.PUBLIC_URL ;
const devPort = process.env.PORT || 3000;
export const BASE_URL = process.env.NODE_ENV === 'development' ? `http://localhost:${devPort}` : `${ENV_BASE_URL}`;
export const API_URL = `${ENV_BASE_URL}/api`;

// The key used by redux-persist for storing the state in the local storage
export const APP_PERSIST_KEY = 'skeleton_proj';
