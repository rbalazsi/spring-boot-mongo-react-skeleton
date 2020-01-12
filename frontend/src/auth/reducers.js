import jwtDecode from "jwt-decode";
import {getAccessToken} from "../utils";
import {LOGIN_FAILURE, LOGIN_FULFILL, LOGIN_SENDING, LOGIN_SUCCESS} from "./actions";
import {LOCATION_CHANGE} from "connected-react-router";

const decodeUserData = () => {
    const token = localStorage.getItem('access_token');
    if (!token)  return null;

    const user = jwtDecode(token);
    return {
        id: user.id,
        email: user.user_name,
        firstName: user.first_name,
        lastName: user.last_name,
        dateJoined: user.date_joined,
        exp: user.exp
    }
};

const auth = (state = {
    isFetching: false,
    isAuthenticated: !!getAccessToken(),
    user: decodeUserData(),
    errorMessage: null,
    errorCode: null
}, action = null) => {
    switch (action.type) {
        case LOGIN_SENDING:
            return {
                ...state,
                isFetching: true
            };

        case LOGIN_SUCCESS:
            return {
                isAuthenticated: true,
                errorMessage: null,
                user: {
                    id: action.data.id,
                    email: action.data.user_name,
                    firstName: action.data.first_name,
                    lastName: action.data.last_name,
                    dateJoined: action.data.date_joined
                }
            };

        case LOGIN_FAILURE:
            return {
                isAuthenticated: false,
                errorMessage: action.error.message,
                errorCode: action.error.code,
                user: null
            };

        case LOGIN_FULFILL:
            return {
                ...state,
                isFetching: false
            };

        case LOCATION_CHANGE:
            // Reset errors on route change
            return {
                ...state,
                errorMessage: null,
                errorCode: null
            };

        default:
            return state;
    }
};

export default auth;