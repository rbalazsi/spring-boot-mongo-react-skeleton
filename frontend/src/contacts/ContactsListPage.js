import React from 'react';

/**
 * Contacts page.
 *
 * @author Robert Balazsi
 */
export const ContactsListPage = ({contacts}) => {

    return (
        <div className="main-panel container-fluid">
            <table className="mt-3" border="1" cellPadding="2">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Date Joined</th>
                </tr>
                </thead>

                <tbody>
                {contacts.map( (c, i) => <tr key={"item" + i}>
                    <td>{c.email}</td>
                    <td>{c.firstName}</td>
                    <td>{c.lastName}</td>
                    <td>{c.dateJoined}</td>
                </tr>)}
                </tbody>
            </table>
        </div>
    )
};
