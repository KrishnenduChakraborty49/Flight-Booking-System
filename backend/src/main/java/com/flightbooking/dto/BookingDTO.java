package com.flightbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private String bookingReference;
    private LocalDateTime bookingDate;
    private BigDecimal totalAmount;
    private String bookingStatus;
    
    private Long userId;
    private String userEmail;
    private String userFullName;
    
    private Long flightId;
    private String flightNumber;
    private String airline;
    private String source;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    private List<PassengerDetail> passengers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PassengerDetail {
        private Long id;
        private String fullName;
        private Integer age;
        private String gender;
        private String passportNumber;
        private String seatNumber;
        private String seatClass;
    }
}
