package org.skeleton.domain;

import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Objects;

@Document(collection = "contacts")
public class Contact extends BaseEntity {

    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime dateJoined;

    public Contact() {
        // empty
    }

    public Contact(String userId, String email, String firstName, String lastName, LocalDateTime dateJoined) {
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateJoined = dateJoined;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDateTime getDateJoined() {
        return dateJoined;
    }

    public void setDateJoined(LocalDateTime dateJoined) {
        this.dateJoined = dateJoined;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        Contact campaign = (Contact) o;
        return Objects.equals(userId, campaign.userId) &&
                Objects.equals(email, campaign.email) &&
                Objects.equals(firstName, campaign.firstName) &&
                Objects.equals(lastName, campaign.lastName) &&
                Objects.equals(dateJoined, campaign.dateJoined);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), userId, email, firstName, lastName, dateJoined);
    }
}
