package org.skeleton;

import org.skeleton.domain.AccountStatus;
import org.skeleton.domain.Contact;
import org.skeleton.domain.Role;
import org.skeleton.domain.User;
import org.skeleton.repository.ContactRepository;
import org.skeleton.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class BackendApp implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(BackendApp.class, args);
    }

    // NOTE: Remove this dummy initialization in production
    @Override
    public void run(String... args) throws Exception {

        final String userName = "user";
        final String password = "test";

        User user = userRepository.findByUserName(userName);
        if (user == null) {
            user = new User();
            user.setUserName(userName);
            user.setFirstName("John");
            user.setLastName("Doe");
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(Role.ROLE_USER);
            user.setAccountStatus(AccountStatus.ACTIVE);
            user = userRepository.save(user);
        }

        // Add some dummy business entities if there are none yet
        List<Contact> contacts = contactRepository.findAll();
        if (contacts.isEmpty()) {
            contactRepository.saveAll(Arrays.asList(
                    new Contact(user.getId(), "duke.nukem@google.com", "Duke", "Nukem", LocalDateTime.of(LocalDate.now(), LocalTime.of(8, 30, 10))),
                    new Contact(user.getId(), "john.doe@google.com", "John", "Doe", LocalDateTime.of(LocalDate.now(), LocalTime.of(9, 17, 10)))
            ));
        }
    }
}
