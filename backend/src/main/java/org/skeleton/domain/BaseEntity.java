package org.skeleton.domain;

import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public abstract class BaseEntity implements Serializable {

    @Id
    protected String id;

    protected LocalDateTime createdAt = LocalDateTime.now();

    public BaseEntity() {
        // empty
    }

    // Getters
    public String getId() {
        return id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BaseEntity that = (BaseEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, createdAt);
    }
}
