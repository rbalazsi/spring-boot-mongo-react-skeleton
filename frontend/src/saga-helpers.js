import {take, put, call} from 'redux-saga/effects'
import {push} from "connected-react-router";

/**
 * Returns the request Redux action for a given action prefix.
 */
export const requestAction = (prefix) => `${prefix}/REQUEST`;

/**
 * Returns the sending Redux action for a given action prefix.
 */
export const sendingAction = (prefix) => `${prefix}/SENDING`;

/**
 * Returns the success Redux action for a given action prefix.
 */
export const successAction = (prefix) => `${prefix}/SUCCESS`;

/**
 * Returns the failure Redux action for a given action prefix.
 */
export const failureAction = (prefix) => `${prefix}/FAILURE`;

/**
 * Returns the fulfill Redux action for a given action prefix.
 */
export const fulfillAction = (prefix) => `${prefix}/FULFILL`;

const getMetaValue = (meta, requestData, response, stage) => {
    if (!meta) {
        return null;
    }

    if (typeof meta !== 'function') {
        return meta;
    }

    return meta({requestData, response, stage});
};

/**
 * Sets up a Redux Saga with a full flow of watching an API action request, calling the fetcher and dispatching appropriate
 * actions for the different states of the request. It takes the following assumptions:
 * 1. The request action should have exactly one parameter named 'data', that is passed to the fetcher as the only argument
 * 2. The response of the fetch call has the following fields:
 *   - status: a brief status message
 *   - code: the status code
 *   - error: the error message (in case of failures)
 *   - result: the response payload
 *
 * @param actionPrefix the action's prefix, from which all the actions will be inferred
 * @param fetcher a function that is called right after the 'sending' action was dispatched
 * @param redirectOnSuccess a string holding or a function returning the URL to which to redirect to (if present) on success
 * @param redirectOnFailure a string holding or a function returning the URL to which to redirect to (if present) on failure, EXCEPT on network error (no redirect in that case)
 * @param meta either an object or a function to return metadata in case of success/failure; if it's a function, it gets the
 *        bag of parameters: requestData, response, stage
 * @returns {Function} the resulting saga (technically a generator function)
 */
export const createApiRequestWatcher = ({actionPrefix, fetcher, redirectOnSuccess, redirectOnFailure, meta}) => (function*() {
    while (true) {
        // Watch for the request
        const request = yield take(requestAction(actionPrefix));

        // Notify the reducers that action is in progress
        yield put({
            type: sendingAction(actionPrefix),
            meta: getMetaValue(meta, request.data, null, 'sending')
        });

        try {
            // Call the fetcher with the request's details
            const response = yield call(fetcher, request.data);

            // The fetch request is considered successful on any 2xx status code
            if (response.code >= 200 && response.code < 300) {
                yield put({
                    type: successAction(actionPrefix),
                    result: response.result,
                    meta: getMetaValue(meta, request.data, response, 'success')
                });

                // If the 'redirectOnSuccess' is set, redirect to it
                if (!!redirectOnSuccess) {
                    const redirectTo = typeof redirectOnSuccess === 'string'
                        ? redirectOnSuccess
                        : redirectOnSuccess({requestData: request.data, response});

                    if (!!redirectTo) {
                        yield put(push(redirectTo));
                    }
                }
            }
            // Otherwise the fetch failed; dispatch the failure action with the appropriate status code and message
            else {
                yield put({
                    type: failureAction(actionPrefix),
                    error: {code: response.code, message: response.error},
                    meta: getMetaValue(meta, request.data, response, 'failure')
                });

                // If the 'redirectOnFailure' is set, redirect to it
                if (!!redirectOnFailure) {
                    const redirectTo = typeof redirectOnFailure === 'string'
                        ? redirectOnFailure
                        :redirectOnFailure({requestData: request.data, response});

                    if (!!redirectTo) {
                        yield put(push(redirectTo));
                    }
                }
            }
        }
            // There was been a network failure, i.e. the Server may be down
        catch (e) {
            console.error("[apiRequestWatcher] error: ", e);
            yield put({
                type: failureAction(actionPrefix),
                error: {status: 0, message: 'Network failure'},
                meta: getMetaValue(meta, request.data, null, 'failure')
            });
        }
        // Irrespective of the result (success or failure), notify the reducers that the request has been fulfilled
        finally {
            yield put({type: fulfillAction(actionPrefix)});
        }
    }
});
