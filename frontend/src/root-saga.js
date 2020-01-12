import {all, fork} from 'redux-saga/effects';
import {authenticationFlows} from "./auth/auth-saga";
import {contactManagementFlows} from "./contacts/sagas";

export default function* rootSaga() {
    yield all([
        fork(authenticationFlows),
        fork(contactManagementFlows)
    ])
}