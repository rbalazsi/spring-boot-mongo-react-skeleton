package org.skeleton.repository;

import org.skeleton.domain.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ContactRepository extends MongoRepository<Contact, String> {

    List<Contact> findAllByUserId(String userID);
}
