package com.flightbooking.config;

import com.flightbooking.dto.FlightDTO;
import com.flightbooking.dto.RegisterRequest;
import com.flightbooking.repository.UserRepository;
import com.flightbooking.service.AuthService;
import com.flightbooking.service.FlightService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final FlightService flightService;

    public DatabaseSeeder(UserRepository userRepository, AuthService authService, FlightService flightService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.flightService = flightService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            RegisterRequest adminRequest = new RegisterRequest();
            adminRequest.setFullName("System Admin");
            adminRequest.setEmail("admin@flight.com");
            adminRequest.setPassword("password");
            adminRequest.setPhoneNumber("+1234567890");
            authService.register(adminRequest);

            RegisterRequest userRequest = new RegisterRequest();
            userRequest.setFullName("John Doe");
            userRequest.setEmail("user@flight.com");
            userRequest.setPassword("password");
            userRequest.setPhoneNumber("+9876543210");
            authService.register(userRequest);
        }

        if (flightService.getAllFlights().isEmpty()) {
            LocalDateTime now = LocalDateTime.now();

            flightService.createFlight(FlightDTO.builder()
                    .flightNumber("AA-101")
                    .airline("American Airlines")
                    .source("New York (JFK)")
                    .destination("Los Angeles (LAX)")
                    .departureTime(now.withHour(8).withMinute(0))
                    .arrivalTime(now.withHour(11).withMinute(30))
                    .duration("6h 30m")
                    .price(new BigDecimal("299.99"))
                    .build());

            flightService.createFlight(FlightDTO.builder()
                    .flightNumber("BA-227")
                    .airline("British Airways")
                    .source("London (LHR)")
                    .destination("New York (JFK)")
                    .departureTime(now.plusDays(1).withHour(14).withMinute(15))
                    .arrivalTime(now.plusDays(1).withHour(17).withMinute(45))
                    .duration("8h 30m")
                    .price(new BigDecimal("549.50"))
                    .build());

            flightService.createFlight(FlightDTO.builder()
                    .flightNumber("EK-502")
                    .airline("Emirates")
                    .source("Paris (CDG)")
                    .destination("Dubai (DXB)")
                    .departureTime(now.plusDays(2).withHour(21).withMinute(30))
                    .arrivalTime(now.plusDays(3).withHour(6).withMinute(15))
                    .duration("6h 45m")
                    .price(new BigDecimal("799.00"))
                    .build());

            flightService.createFlight(FlightDTO.builder()
                    .flightNumber("AI-302")
                    .airline("Air India")
                    .source("Mumbai (BOM)")
                    .destination("Delhi (DEL)")
                    .departureTime(now.plusDays(3).withHour(6).withMinute(45))
                    .arrivalTime(now.plusDays(3).withHour(9).withMinute(0))
                    .duration("2h 15m")
                    .price(new BigDecimal("120.00"))
                    .build());

            // Kolkata (CCU) -> London (LHR) Flight 1: Air India
            flightService.createFlight(FlightDTO.builder()
                    .flightNumber("AI-111")
                    .airline("Air India")
                    .source("Kolkata (CCU)")
                    .destination("London (LHR)")
                    .departureTime(now.withHour(10).withMinute(0))
                    .arrivalTime(now.withHour(16).withMinute(30))
                    .duration("11h 30m")
                    .price(new BigDecimal("650.00"))
                    .build());

            // Kolkata (CCU) -> London (LHR) Flight 2: Indigo
            flightService.createFlight(FlightDTO.builder()
                    .flightNumber("6E-201")
                    .airline("IndiGo")
                    .source("Kolkata (CCU)")
                    .destination("London (LHR)")
                    .departureTime(now.withHour(18).withMinute(30))
                    .arrivalTime(now.plusDays(1).withHour(2).withMinute(0))
                    .duration("12h 30m")
                    .price(new BigDecimal("450.00"))
                    .build());
        }
    }
}