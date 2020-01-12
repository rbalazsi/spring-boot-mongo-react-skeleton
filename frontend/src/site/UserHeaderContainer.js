/**
 * Container for UserHeader.
 * @author Robert Balazsi
 */

import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {UserHeader} from "./UserHeader";
import {logout} from "../auth/actions";

export const UserHeaderContainer = () => {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    return <UserHeader user={user} onLogout={() => dispatch( logout() )}/>;
};