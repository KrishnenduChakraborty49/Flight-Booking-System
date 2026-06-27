package com.flightbooking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SeatSelectionRequest {
    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotEmpty(message = "Seat numbers are required")
    private List<String> seatNumbers;
}
