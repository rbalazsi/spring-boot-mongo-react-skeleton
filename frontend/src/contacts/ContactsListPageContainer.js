import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {UserHeaderContainer} from "../site/UserHeaderContainer";
import {ContactsListPage} from "./ContactsListPage";
import {fetchContacts} from "./actions";

/**
 * Fetches and displays the list of contacts.
 *
 */
export const ContactsListPageContainer = () => {

    const isFetching = useSelector(state => state.contacts.isFetching);
    const contacts = useSelector(state => state.contacts.list);
    const dispatch = useDispatch();

    // Fetch the list of contacts on page load
    useEffect( () => {
        dispatch(fetchContacts());
    }, []);

    return (
        <div id="wrapper">
            <UserHeaderContainer />

            <main className="main-panel d-flex flex-column flex-lg-row">
                {isFetching
                    ? <span><i className="fas fa-spinner fa-spin"/> Loading</span>
                    : <ContactsListPage contacts={contacts} />}
            </main>
        </div>
    );
};
