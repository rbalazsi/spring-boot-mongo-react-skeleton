package org.skeleton.rest;

import org.skeleton.domain.Contact;
import org.skeleton.repository.ContactRepository;
import org.skeleton.utils.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoint for managing a list of contacts.
 *
 * @author Robert Balazsi
 */
@RestController
@RequestMapping("/api/contacts")
@CrossOrigin
public class ContactResource {

    private final ContactRepository contactRepository;

    @Autowired
    public ContactResource(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * Gets all contacts of the currently authenticated user.
     *
     * @param authentication the auth object
     * @return the list of contacts
     */
    @GetMapping
    public ResponseEntity<ApiResult<List<Contact>>> getAll(Authentication authentication) {
        String userID = AuthUtils.extractUserID(authentication);
        List<Contact> contacts = contactRepository.findAllByUserId(userID);
        return ResponseEntity.ok(new ApiResult<>(HttpStatus.OK.value(), null, contacts));
    }
}
