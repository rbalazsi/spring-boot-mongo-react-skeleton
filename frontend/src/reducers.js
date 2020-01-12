import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import auth from "./auth/reducers";
import contacts from "./contacts/reducers";

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    auth,
    contacts
});

export default createRootReducer;