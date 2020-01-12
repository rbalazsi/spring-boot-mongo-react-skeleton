package org.skeleton.utils;

import org.skeleton.security.User;
import org.springframework.security.core.Authentication;

/**
 * Utility methods related to authentication / authorization.
 *
 * @author Robert Balazsi
 */
public class AuthUtils {

    public static String extractUserID(Authentication authentication) {
        User user = (User)authentication.getPrincipal();
        return user.getId();
    }
}
