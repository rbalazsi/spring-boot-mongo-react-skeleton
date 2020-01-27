/**
 * Defines utility functions.
 */

import jwtDecode from "jwt-decode";
import {VERSIONED_JSON_MIME_TYPE} from "./constants";

export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
};

export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

export const isTokenExpiring = (token) => {
    let expiration = jwtDecode(token).exp;
    return (expiration && (expiration*1000 - Date.now() < 5000));
};

export const isTokenExpired = (token) => {
    let expiration = jwtDecode(token).exp;
    return (expiration && (expiration*1000 < Date.now()));
};

export const isUserAuthenticated = (state) => {
    const refreshToken = getRefreshToken();
    return (state.auth.isAuthenticated && !!refreshToken && !isTokenExpired(refreshToken));
};

export const withAuth = (headers = {}) => ({
    ...headers,
    'Authorization': `Bearer ${getAccessToken()}`
});

export const jsonWithAuth = () => withAuth({
    'Accept': VERSIONED_JSON_MIME_TYPE,
    'Content-Type': VERSIONED_JSON_MIME_TYPE
});

export const hasAdminRole = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        return false;
    }
    const user = jwtDecode(token);
    return user.role === 'ADMIN';
};
