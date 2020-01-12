import React from 'react'
import { Provider } from 'react-redux'
import reduxReset from 'redux-reset'
import {createStore, applyMiddleware, compose} from 'redux'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import {Route, Switch, Redirect} from 'react-router-dom';
import createRootReducer from '../reducers'
import {createBrowserHistory} from 'history'
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import {hasAdminRole, isUserAuthenticated} from "../utils";
import {LoginPageContainer} from "../auth/LoginPageContainer";
import rootSaga from "../root-saga";
import {APP_PERSIST_KEY} from "../constants";
import {LOGOUT} from "../auth/actions";
import {ContactsListPageContainer} from "../contacts/ContactsListPageContainer";

// The Redux Devtools extension (Chrome and Firefox), if available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createBrowserHistory();

const persisterConfig = {
    key: APP_PERSIST_KEY,
    storage,
    blacklist: ['notify']
};

const sagaMiddleware = createSagaMiddleware();

const appReducer = persistReducer(persisterConfig, createRootReducer(history));

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        return undefined;
    }

    return appReducer(state, action);
};

const middlewares = [
    routerMiddleware(history),
    sagaMiddleware
];

// Add the logger middleware only in development mode
if (process.env.NODE_ENV === 'development') {
    const { logger } = require(`redux-logger`);
    middlewares.push(logger);
}

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            ...middlewares
        ),
        reduxReset(),
    )
);

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

const locationHelper = locationHelperBuilder({});

const isNotAuthenticated = connectedRouterRedirect({
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false,
    authenticatedSelector: state => !isUserAuthenticated(state),
    wrapperDisplayName: 'UserIsNotAuthenticated'
});

const isAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => isUserAuthenticated(state),
    redirectPath: '/login',
    wrapperDisplayName: 'UserIsAuthenticated'
});

const isNotAdmin = connectedRouterRedirect({
    authenticatedSelector: () => !hasAdminRole(),
    redirectPath: '/admin',
    wrapperDisplayName: 'UserIsNotAdmin',
    allowRedirectBack: false
});

/**
 * The root component. It routes different paths to their respective components.
 */
const Root = () => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <ConnectedRouter history={history}>
                <Switch>
                    {/* Login page */}
                    <Route path="/login" component={isNotAuthenticated(LoginPageContainer)}/>

                    {/* Business page */}
                    <Route exact path="/contacts" component={isAuthenticated(isNotAdmin(ContactsListPageContainer))} />

                    <Redirect to="/contacts" />
                </Switch>
            </ConnectedRouter>
        </PersistGate>
    </Provider>
);

export default Root;
