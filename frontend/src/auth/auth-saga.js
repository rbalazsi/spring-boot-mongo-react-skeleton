import {take, takeLatest, put, call, fork, race} from 'redux-saga/effects'
import {push} from "connected-react-router";
import jwtDecode from "jwt-decode";
import {getAccessToken, getRefreshToken, isTokenExpired, isTokenExpiring} from "../utils";
import {ENV_BASE_URL} from "../constants";
import {
    LOGIN_FAILURE, LOGIN_SUCCESS,
    LOGIN_REQUEST,
    LOGOUT,
    REFRESH_TOKEN_FAILURE,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_REQUEST, LOGIN_SENDING, LOGIN_FULFILL
} from "./actions";

const login = (email, password) => fetch(`${ENV_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=password&client_id=skeleton_app&client_secret=s3crEt&username=${email}&password=${password}`,
}).then( resp => resp.json().then(data => ({
    status: resp.status,
    statusText: resp.statusText,
    payload: data
})) );

const storeAccessToken = (token) => localStorage.setItem('access_token', token);
const storeRefreshToken = (token) => localStorage.setItem('refresh_token', token);

/**
 * Monitors login requests. If the login is successful, the access resp. refresh tokens are saved in the local storage,
 * otherwise appropriate error messages are returned.
 */
function* loginFlow() {
    while (true) {
        const request = yield take(LOGIN_REQUEST);
        const {userName, password} = request.creds;

        try {
            yield put({type: LOGIN_SENDING});

            // NOTE: If a logout is triggered while the login request is in progress, we need to cancel the login
            const loginOrLogoutRace = yield race({
                login: call(login, userName, password),
                logout: take(LOGOUT)
            });

            if (loginOrLogoutRace.login) {
                const response = loginOrLogoutRace.login;

                // Login successful
                if (response.status === 200) {
                    const accessToken = response.payload.access_token;

                    // Store the tokens in the local storage
                    storeAccessToken(accessToken);
                    storeRefreshToken(response.payload.refresh_token);

                    // Also decode the access token and dispatch the appropriate action with its payload
                    const decodedToken = jwtDecode(accessToken);
                    yield put({type: LOGIN_SUCCESS, data: decodedToken})
                }
                // Login failed
                else {
                    yield put({type: LOGIN_FAILURE, error: {status: response.status, message: response.payload.error_description}});
                }
            }
        } catch (e) {
            yield put({type: LOGIN_FAILURE, error: {status: 0, message: 'Network failure'}});
        } finally {
            yield put({type: LOGIN_FULFILL})
        }
    }
}

const ignoredActions = ['login', 'logout', 'refreshToken', 'persist', '@@router'];

const monitoredAction = (action) => !action.type || (!!action.type && action.type
        .includes('REQUEST') && ignoredActions
    .every(fragment => !action.type.includes(fragment)));

const refreshAccessToken = (refreshToken) => fetch(`${ENV_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `grant_type=refresh_token&client_id=skeleton&client_secret=s3crEt&refresh_token=${refreshToken}`
}).then( resp => resp.json() );

/**
 * Monitors protected API actions and refreshes the access token if it's expired (or will expire soon). If the token is
 * already expired, it will retry the current action after the new token is received. If the refresh fails, it dispatches
 * a logout.
 *
 * @param action the current action
 */
function* monitorProtectedAction(action) {
    // Check if the access token is expiring soon or already expired
    const accessToken = getAccessToken();

    if (!!accessToken && isTokenExpiring(accessToken)) {

        // Get the refresh token and call the backend to refresh the access token
        const refreshToken = getRefreshToken();
        if (!!refreshToken) {
            try {
                yield put({type: REFRESH_TOKEN_REQUEST});
                const response = yield call(refreshAccessToken, refreshToken);
                const token = response.access_token;

                // Store access the token in the local storage
                storeAccessToken(token);

                // Also decode it and dispatch the appropriate action with its payload
                const decodedToken = jwtDecode(token);
                yield put({type: REFRESH_TOKEN_SUCCESS, data: decodedToken});

                // Retry the action if the token was already expired
                if (isTokenExpired(accessToken)) {
                    yield put(action);
                }
            } catch (e) {
                yield put({type: REFRESH_TOKEN_FAILURE, error: e});
                yield put({type: LOGOUT});
            }
        } else {
            yield put({type: LOGOUT});
        }
    }
}

function* refreshTokenFlow() {
    yield takeLatest(monitoredAction, monitorProtectedAction)
}

/**
 * Monitors logout requests and removes the
 * @return {IterableIterator<*>}
 */
function* logoutFlow() {
    while (true) {
        yield take(LOGOUT);

        // Clear the local storage
        localStorage.clear();

        // Redirect to "/"
        yield put( push("/") )
    }
}


export function* authenticationFlows() {
    yield fork(loginFlow);
    yield fork(refreshTokenFlow);
    yield fork(logoutFlow)
}