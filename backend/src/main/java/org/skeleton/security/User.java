package org.skeleton.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Augments Spring's user details with an extra ID field, so the user's ID will be automatically injected/retrieved for each REST request.
 *
 * @author Robert Balazsi
 */
public class User extends org.springframework.security.core.userdetails.User {

    private String id;

    public User(String id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
    }

    public User(String id, String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
