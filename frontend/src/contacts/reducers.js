
import {
    FETCH_CONTACTS_FAILURE,
    FETCH_CONTACTS_SUCCESS,
    FETCH_CONTACTS_FULFILL, FETCH_CONTACTS_SENDING
} from "./actions";

const contacts = (state = {
    // Status
    isFetching: false,
    statusCode: null,

    // Data
    list: []
}, action = null) => {

    switch (action.type) {

        case FETCH_CONTACTS_SENDING:
            return {
                ...state,
                isLoading: true,
            };

        case FETCH_CONTACTS_FULFILL:
            return {
                ...state,
                isLoading: false,
            };

        case FETCH_CONTACTS_SUCCESS:
            return {
                ...state,
                list: action.result
            };

        case FETCH_CONTACTS_FAILURE:
            return {
                ...state,
                statusCode: action.error.code,
                list: []
            };

        default:
            return state;
    }
};

export default contacts;