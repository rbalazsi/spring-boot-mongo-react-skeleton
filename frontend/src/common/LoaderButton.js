import React from 'react';
import PropTypes from 'prop-types';


/**
 * A button that animates a spinner and displays a custom text while in loading state (there is background processing of
 * some kind).
 */
export const LoaderButton = ({children, className, disabled, isLoading, loadingText, ...others}) => (
    <button {...others}
            className={`LoaderButton btn ${className}`}
            disabled={disabled || isLoading}>
        {isLoading && <i className="fas fa-spinner fa-spin" />} {!isLoading ? children : loadingText}
    </button>
);

LoaderButton.propTypes = {
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
    loadingText: PropTypes.string
};

LoaderButton.defaultProps = {
    className: '',
    disabled: false
};

