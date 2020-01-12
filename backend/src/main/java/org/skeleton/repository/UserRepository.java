package org.skeleton.repository;

import org.skeleton.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Mongo repository for {@link User} objects.
 * @author Robert Balazsi
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    User findByUserName(String userName);
}
