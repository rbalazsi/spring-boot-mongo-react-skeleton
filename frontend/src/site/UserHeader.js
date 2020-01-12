import React from 'react';
import PropTypes from "prop-types";

/**
 * Header component for users.
 *
 * @author Robert Balazsi
 */
export const UserHeader = ({user, onLogout}) => {

    return (
        <header className="navbar navbar-expand navbar-dark app-header bg-primary">
            <a className="navbar-brand" href="/contacts">
                <span className="logo-brand text-white ml-2">Skeleton App</span>
            </a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>

            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow">
                    <button className="btn btn-link nav-link dropdown-toggle" id="userDropdown"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{user.firstName}</span>
                        <i className="fas fa-user"/>
                    </button>

                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                         aria-labelledby="userDropdown">
                        <button className="dropdown-item" onClick={onLogout}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"/> Logout
                        </button>
                    </div>
                </li>
            </ul>
        </header>
    );
};

UserHeader.propTypes = {
    onLogout: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};
