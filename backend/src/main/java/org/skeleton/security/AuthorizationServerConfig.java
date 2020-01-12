package org.skeleton.security;

import org.skeleton.domain.User;
import org.skeleton.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.AccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultUserAuthenticationConverter;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.UserAuthenticationConverter;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.oauth2.provider.token.store.KeyStoreKeyFactory;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Configuration for the OAuth2 authorization server.
 *
 * @author Robert Balazsi
 */
@Configuration
@EnableAuthorizationServer
@Order(2)
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private AdminProperties adminProperties;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OAuth2ClientProperties oAuth2ClientProperties;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
                .withClient(oAuth2ClientProperties.getClientId())
                .secret(passwordEncoder.encode(oAuth2ClientProperties.getClientSecret()))
                .autoApprove(true)
                .authorizedGrantTypes(oAuth2ClientProperties.getAuthorizedGrantTypes().toArray(new String[] {}))
                .authorities(oAuth2ClientProperties.getAuthorities().toArray(new String[] {}))
                .scopes(oAuth2ClientProperties.getScope().toArray(new String[] {}))
                .accessTokenValiditySeconds(oAuth2ClientProperties.getAccessTokenValiditySeconds())
                .refreshTokenValiditySeconds(oAuth2ClientProperties.getRefreshTokenValiditySeconds());
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        security.allowFormAuthenticationForClients();
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.tokenStore(tokenStore())
                .tokenEnhancer(jwtAccessTokenConverter())
                .userDetailsService(userDetailsService)
                .authenticationManager(authenticationManager);
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(jwtAccessTokenConverter());
    }

    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter converter = new UserDetailsJwtTokenEnhancer(adminProperties, userRepository);
        converter.setAccessTokenConverter(accessTokenConverter());
        KeyStoreKeyFactory keyStoreKeyFactory =
                new KeyStoreKeyFactory(new ClassPathResource("skeleton.jks"), "skeleton-pass".toCharArray());
        converter.setKeyPair(keyStoreKeyFactory.getKeyPair("skeleton"));
        return converter;
    }

    @Bean
    public UserAuthenticationConverter userAuthenticationConverter () {
        DefaultUserAuthenticationConverter authenticationConverter = new DefaultUserAuthenticationConverter();
        authenticationConverter.setUserDetailsService(userDetailsService);
        return authenticationConverter;
    }

    @Bean
    public AccessTokenConverter accessTokenConverter() {
        DefaultAccessTokenConverter accessTokenConverter = new DefaultAccessTokenConverter();
        accessTokenConverter.setUserTokenConverter(userAuthenticationConverter());
        return accessTokenConverter;
    }

    protected static class UserDetailsJwtTokenEnhancer extends JwtAccessTokenConverter {

        private AdminProperties adminProperties;
        private UserRepository userRepository;

        public UserDetailsJwtTokenEnhancer(AdminProperties adminProperties, UserRepository userRepository) {
            this.adminProperties = adminProperties;
            this.userRepository = userRepository;
        }

        @Override
        public OAuth2AccessToken enhance(OAuth2AccessToken accessToken,
                                         OAuth2Authentication authentication) {
            org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            Map<String, Object> info = new LinkedHashMap<>(accessToken.getAdditionalInformation());
            if (principal.getUsername().equals(adminProperties.getEmail())) {
                info.put("first_name", adminProperties.getFirstName());
                info.put("last_name", adminProperties.getLastName());
                info.put("role", "ADMIN");
            } else {
                User user = userRepository.findByUserName(principal.getUsername());
                info.put("id", user.getId());
                info.put("first_name", user.getFirstName());
                info.put("last_name", user.getLastName());
                info.put("role", "USER");
                info.put("date_joined", user.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME));
            }

            DefaultOAuth2AccessToken customAccessToken = new DefaultOAuth2AccessToken(accessToken);
            customAccessToken.setAdditionalInformation(info);
            return super.enhance(customAccessToken, authentication);
        }
    }
}
