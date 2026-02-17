package com.rideshare.service;

import com.rideshare.dto.EducationDto;
import com.rideshare.dto.FullRegistrationRequest;
import com.rideshare.dto.SyncUserRequest;
import com.rideshare.dto.VehicleDto;
import com.rideshare.model.*;
import com.rideshare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User syncUser(SyncUserRequest request) {
        return userRepository.findById(request.getId())
                .map(existingUser -> {
                    // Update fields if necessary
                    existingUser.setEmail(request.getEmail());
                    existingUser.setName(request.getName());
                    // Role typically shouldn't change via sync, but for simplicity:
                    // existingUser.setRole(request.getRole());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setId(request.getId());
                    newUser.setEmail(request.getEmail());
                    newUser.setName(request.getName());
                    newUser.setRole(request.getRole());
                    newUser.setStatus(UserStatus.PENDING); // Default status
                    return userRepository.save(newUser);
                });
    }

    @Transactional
    public User registerUser(FullRegistrationRequest request) {
        User user = userRepository.findById(request.getId()).orElse(new User());
        
        user.setId(request.getId());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setProfilePhotoUrl(request.getProfilePhotoUrl());
        user.setAadharCardUrl(request.getAadharCardUrl());
        user.setPanCardUrl(request.getPanCardUrl());
        user.setDrivingLicenseUrl(request.getDrivingLicenseUrl());
        user.setStatus(UserStatus.PENDING); // Always pending on new registration

        // Handle Education
        if (request.getEducationDetails() != null) {
            List<Education> educationList = request.getEducationDetails().stream().map(dto -> {
                Education edu = new Education();
                edu.setLevel(dto.getLevel());
                edu.setInstitutionName(dto.getInstitutionName());
                edu.setPassingYear(dto.getPassingYear());
                edu.setPercentage(dto.getPercentage());
                edu.setUser(user);
                return edu;
            }).collect(Collectors.toList());
            user.setEducationDetails(educationList);
        }

        // Handle Vehicle (Only for drivers)
        if (request.getRole() == Role.DRIVER && request.getVehicleDetails() != null) {
            VehicleDto vDto = request.getVehicleDetails();
            Vehicle vehicle = new Vehicle();
            vehicle.setCompany(vDto.getCompany());
            vehicle.setModel(vDto.getModel());
            vehicle.setRegistrationNumber(vDto.getRegistrationNumber());
            vehicle.setRcNumber(vDto.getRcNumber());
            vehicle.setInsuranceNumber(vDto.getInsuranceNumber());
            vehicle.setYearOfModel(vDto.getYearOfModel());
            vehicle.setHasAc(vDto.getHasAc());
            vehicle.setAudioSystem(vDto.getAudioSystem());
            vehicle.setKmDriven(vDto.getKmDriven());
            vehicle.setColor(vDto.getColor());
            vehicle.setImageUrls(vDto.getImageUrls());
            vehicle.setDriver(user);
            user.setVehicle(vehicle);
        }

        return userRepository.save(user);
    }
}
