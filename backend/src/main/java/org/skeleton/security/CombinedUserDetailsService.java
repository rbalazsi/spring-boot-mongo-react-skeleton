package org.skeleton.security;


import org.skeleton.domain.User;
import org.skeleton.domain.AccountStatus;
import org.skeleton.domain.Role;
import org.skeleton.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Service class for loading user details for two types of users:
 * <ul>
 *     <li>Admin - credentials loaded from external configuration file</li>
 *     <li>User - credentials loaded from database</li>
 * </ul>
 *
 * @author Robert Balazsi
 */
@Service
public class CombinedUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminProperties adminProperties;

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws AuthenticationException {
        if (adminProperties.getEmail().equals(userName)) {
            return new org.springframework.security.core.userdetails.User(
                    adminProperties.getEmail(), adminProperties.getPassword(), true, true, true, true,
                    Collections.singletonList(new SimpleGrantedAuthority(Role.ROLE_ADMIN.name()))
            );
        }
        User user = userRepository.findByUserName(userName);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("User with email '%s' not found.", userName));
        }

        return new org.skeleton.security.User(user.getId(),
                user.getUserName(), user.getPassword(), user.getAccountStatus() == AccountStatus.ACTIVE, true, true, true,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}
