package org.skeleton.domain;

/**
 * Enumerates the account status of a user.
 * @author Robert Balazsi
 */
public enum AccountStatus {
    ACTIVE,
    PENDING, // after registration but before confirming it via confirmation mail link
    DELETED
}
