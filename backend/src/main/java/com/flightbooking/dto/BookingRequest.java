package com.flightbooking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotEmpty(message = "Passenger details are required")
    @Valid
    private List<PassengerDTO> passengers;
}
