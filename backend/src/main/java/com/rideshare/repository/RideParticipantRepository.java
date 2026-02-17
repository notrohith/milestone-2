package com.rideshare.repository;

import com.rideshare.model.RideParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RideParticipantRepository extends JpaRepository<RideParticipant, Long> {
    boolean existsByRideIdAndRiderId(Long rideId, UUID riderId);
}
