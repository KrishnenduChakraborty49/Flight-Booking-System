package com.flightbooking.controller;

import com.flightbooking.dto.SeatDTO;
import com.flightbooking.dto.SeatSelectionRequest;
import com.flightbooking.model.User;
import com.flightbooking.repository.UserRepository;
import com.flightbooking.service.SeatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;
    private final UserRepository userRepository;

    public SeatController(SeatService seatService, UserRepository userRepository) {
        this.seatService = seatService;
        this.userRepository = userRepository;
    }

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<SeatDTO>> getSeatsByFlight(@PathVariable Long flightId) {
        return ResponseEntity.ok(seatService.getSeatsByFlightId(flightId));
    }

    @PutMapping("/select")
    public ResponseEntity<Void> selectSeats(Principal principal, @Valid @RequestBody SeatSelectionRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new com.flightbooking.exception.ResourceNotFoundException("User not found"));

        seatService.selectOrLockSeats(request.getFlightId(), request.getSeatNumbers(), user.getId());
        return ResponseEntity.ok().build();
    }
}
