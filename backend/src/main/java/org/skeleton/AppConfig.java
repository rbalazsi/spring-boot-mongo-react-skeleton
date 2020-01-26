package org.skeleton;

import org.skeleton.repository.ContactRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * The main configuration class for the Backend.
 */
@Configuration
@EnableMongoRepositories(basePackageClasses = {ContactRepository.class})
public class AppConfig {

}
