package com.rideshare.controller;

import com.rideshare.dto.CreateRideRequest;
import com.rideshare.dto.UpdateRideStatusRequest;
import com.rideshare.model.Ride;
import com.rideshare.model.User;
import com.rideshare.service.RideService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping
    public ResponseEntity<Ride> createRide(@RequestBody CreateRideRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rideService.createRide(request, user.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Ride>> searchRides(@RequestParam String source, @RequestParam String dest) {
        return ResponseEntity.ok(rideService.searchRides(source, dest));
    }

    @GetMapping("/my-rides")
    public ResponseEntity<List<Ride>> getMyRides(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rideService.getMyRides(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ride> getRide(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.getRide(id));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinRide(@PathVariable Long id, @AuthenticationPrincipal User user) {
        rideService.joinRide(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ride> updateStatus(@PathVariable Long id, @RequestBody UpdateRideStatusRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rideService.updateStatus(id, request.getStatus(), user.getId()));
    }
}
