package com.rideshare.repository;

import com.rideshare.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    @Query("SELECT v FROM Vehicle v WHERE v.user.email = :email")
    List<Vehicle> findByUserEmail(@Param("email") String email);
}
