export const LOGIN_REQUEST = 'login/REQUEST';
export const LOGIN_SENDING = 'login/SENDING';
export const LOGIN_SUCCESS = 'login/SUCCESS';
export const LOGIN_FAILURE = 'login/FAILURE';
export const LOGIN_FULFILL = 'login/FULFILL';

export const LOGOUT = 'logout';

export const REFRESH_TOKEN_REQUEST = 'refreshToken/REQUEST';
export const REFRESH_TOKEN_SUCCESS = 'refreshToken/SUCCESS';
export const REFRESH_TOKEN_FAILURE = 'refreshToken/FAILURE';

export const login = (userName, password) => ({
    type: LOGIN_REQUEST,
    creds: {userName, password}
});

export const logout = () => ({type: LOGOUT});
