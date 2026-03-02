package com.rideshare.service;

import com.rideshare.dto.CreateRideRequest;
import com.rideshare.model.*;
import com.rideshare.repository.RideParticipantRepository;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final RideParticipantRepository participantRepository;

    public RideService(RideRepository rideRepository, UserRepository userRepository, RideParticipantRepository participantRepository) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.participantRepository = participantRepository;
    }

    @Transactional
    public Ride createRide(CreateRideRequest request, UUID driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (driver.getRole() != Role.DRIVER) {
            throw new RuntimeException("Only drivers can create rides");
        }

        return buildAndSaveRide(request, driver);
    }

    @Transactional
    public Ride createRideByEmail(CreateRideRequest request) {
        String email = request.getDriverEmail();
        if (email == null || email.isBlank()) {
            throw new RuntimeException("driverEmail is required");
        }

        User driver = userRepository.findFirstByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found for email: " + email));

        if (driver.getRole() != Role.DRIVER) {
            System.out.println("Warning: user " + email + " has role " + driver.getRole() + " but is creating a ride.");
        }

        return buildAndSaveRide(request, driver);
    }

    private Ride buildAndSaveRide(CreateRideRequest request, User driver) {
        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setSourceCity(request.getSourceCity());
        ride.setDestinationCity(request.getDestinationCity());
        ride.setStartTime(request.getStartTime());
        ride.setPricePerSeat(request.getPricePerSeat());
        ride.setTotalSeats(request.getTotalSeats());
        ride.setAvailableSeats(request.getTotalSeats());
        ride.setStatus(RideStatus.CREATED);

        if (request.getPickupPoints() != null) {
            ride.setPickupPoints(String.join(",", request.getPickupPoints()));
        }
        if (request.getDropPoints() != null) {
            ride.setDropPoints(String.join(",", request.getDropPoints()));
        }
        ride.setHasAc(request.getHasAc());
        ride.setLuggageAllowed(request.getLuggageAllowed());
        ride.setGenderPreference(request.getGenderPreference());
        ride.setDistanceKm(request.getDistanceKm());
        ride.setVehicleId(request.getVehicleId());

        return rideRepository.save(ride);
    }

    public List<Ride> searchRides(String source, String dest) {
        if ((source == null || source.isBlank()) && (dest == null || dest.isBlank())) {
            return rideRepository.findAllAvailable(LocalDateTime.now());
        }
        return rideRepository.searchRides(
                source != null ? source : "",
                dest != null ? dest : "",
                LocalDateTime.now()
        );
    }
    
    public List<Ride> getMyRides(UUID driverId) {
        return rideRepository.findByDriverId(driverId);
    }

    public Ride getRide(Long rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
    }

    @Transactional
    public void joinRide(Long rideId, UUID riderId) {
        // PESSIMISTIC LOCK could be added on the repository query, but here we use transactional isolation.
        // For stricter concurrency control, we should ideally lock the row.
        // Assuming default isolation level usually READ_COMMITTED, explicit locking is safer.
        
        // Simpler approach for this demo: Check available seats inside transaction
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
                
        if (ride.getStatus() != RideStatus.CREATED && ride.getStatus() != RideStatus.STARTED) {
             throw new RuntimeException("Ride is not active");
        }

        if (ride.getAvailableSeats() <= 0) {
            throw new RuntimeException("Ride is full");
        }

        boolean alreadyJoined = participantRepository.existsByRideIdAndRiderId(rideId, riderId);
        if (alreadyJoined) {
            throw new RuntimeException("You have already joined this ride");
        }
        
        User rider = userRepository.findById(riderId)
                .orElseThrow(() -> new RuntimeException("Rider not found"));

        // Decrement seats
        ride.setAvailableSeats(ride.getAvailableSeats() - 1);
        rideRepository.save(ride);

        // Add participant
        RideParticipant participant = new RideParticipant();
        participant.setRide(ride);
        participant.setRider(rider);
        participant.setFareAtBooking(ride.getPricePerSeat()); // Snapshot price
        participantRepository.save(participant);
    }

    @Transactional
    public Ride updateStatus(Long rideId, RideStatus status, UUID driverId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!ride.getDriver().getId().equals(driverId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        // Basic lifecycle validation
        if (ride.getStatus() == RideStatus.COMPLETED) {
            throw new RuntimeException("Cannot update completed ride");
        }
        
        // Prevent going back
        if (ride.getStatus() == RideStatus.STARTED && status == RideStatus.CREATED) {
             throw new RuntimeException("Cannot revert started ride to created");
        }

        ride.setStatus(status);
        return rideRepository.save(ride);
    }
}
