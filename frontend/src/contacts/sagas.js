import {fork} from 'redux-saga/effects';
import {createApiRequestWatcher} from "../saga-helpers";
import {API_URL} from "../constants";
import {jsonWithAuth} from "../utils";
import {FETCH_CONTACTS} from "./actions";


const fetchContactsFlow = createApiRequestWatcher({
    actionPrefix: FETCH_CONTACTS,
    fetcher: () => fetch(`${API_URL}/contacts`, {
        method: 'GET',
        headers: jsonWithAuth()
    }).then( resp => resp.json() )
});

export function* contactManagementFlows() {
    yield fork(fetchContactsFlow);
}
