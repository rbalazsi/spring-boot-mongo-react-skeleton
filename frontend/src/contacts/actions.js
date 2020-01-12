import {failureAction, fulfillAction, requestAction, sendingAction, successAction} from "../saga-helpers";


export const FETCH_CONTACTS = 'fetchContacts';
export const FETCH_CONTACTS_REQUEST = requestAction(FETCH_CONTACTS);
export const FETCH_CONTACTS_SENDING = sendingAction(FETCH_CONTACTS);
export const FETCH_CONTACTS_SUCCESS = successAction(FETCH_CONTACTS);
export const FETCH_CONTACTS_FAILURE = failureAction(FETCH_CONTACTS);
export const FETCH_CONTACTS_FULFILL = fulfillAction(FETCH_CONTACTS);

export const fetchContacts = () => ({
    type: FETCH_CONTACTS_REQUEST
});
