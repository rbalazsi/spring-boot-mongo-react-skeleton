import React, {useCallback} from 'react'
import {LoginPage} from './LoginPage'
import {useDispatch, useSelector} from 'react-redux'
import {login} from './actions';

/**
 * Container for the login page.
 */
export const LoginPageContainer = () => {

    const errorCode = useSelector(state => state.auth.errorCode);
    const errorMessage = useSelector(state => state.auth.errorMessage);
    const isLoginSubmitting = useSelector(state => state.auth.isFetching);
    const dispatch = useDispatch();

    const handleLogin = useCallback( (details) => {
        dispatch (login(details.userName, details.password) );
    }, [dispatch]);

    return (
        <LoginPage errorCode={errorCode}
                   errorMessage={errorMessage}
                   isSubmitting={isLoginSubmitting}
                   onLogin={handleLogin}/>
    )
};
