package org.skeleton;

import org.skeleton.repository.ContactRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.http.MediaType;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * The main configuration class for the Backend.
 */
@Configuration
@EnableMongoRepositories(basePackageClasses = {ContactRepository.class})
public class AppConfig {

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
                configurer
                        .defaultContentTypeStrategy(new HeaderContentNegotiationStrategy())
                        .defaultContentType(MediaType.APPLICATION_JSON);
            }
        };
    }
}
