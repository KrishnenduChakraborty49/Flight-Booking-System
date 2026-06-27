package com.flightbooking.service;

import com.flightbooking.dto.AnalyticsDTO;
import com.flightbooking.dto.UserDTO;
import com.flightbooking.repository.BookingRepository;
import com.flightbooking.repository.FlightRepository;
import com.flightbooking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public AdminService(FlightRepository flightRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.flightRepository = flightRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public AnalyticsDTO getAnalytics() {
        long totalFlights = flightRepository.count();
        long totalBookings = bookingRepository.count();
        long totalUsers = userRepository.count();
        
        BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return AnalyticsDTO.builder()
                .totalFlights(totalFlights)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .totalUsers(totalUsers)
                .build();
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .role(user.getRole().name())
                        .build())
                .collect(Collectors.toList());
    }
}
