package com.rideshare.repository;

import com.rideshare.model.Ride;
import com.rideshare.model.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriverId(java.util.UUID driverId);

    @Query("SELECT r FROM Ride r WHERE r.sourceCity = :source AND r.destinationCity = :dest AND r.startTime > :now AND r.availableSeats > 0 AND r.status = 'CREATED'")
    List<Ride> searchRides(@Param("source") String source, @Param("dest") String dest, @Param("now") LocalDateTime now);
}
