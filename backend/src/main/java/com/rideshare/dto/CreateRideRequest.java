package com.rideshare.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateRideRequest {
    private String sourceCity;
    private String destinationCity;
    private LocalDateTime startTime;
    private BigDecimal pricePerSeat;
    private Integer totalSeats;
}
