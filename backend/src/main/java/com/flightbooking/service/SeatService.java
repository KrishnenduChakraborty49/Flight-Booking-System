package com.flightbooking.service;

import com.flightbooking.dto.SeatDTO;
import com.flightbooking.exception.BadRequestException;
import com.flightbooking.model.Seat;
import com.flightbooking.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private static final long LOCK_EXPIRATION_MINUTES = 10;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Transactional
    public List<SeatDTO> getSeatsByFlightId(Long flightId) {
        List<Seat> seats = seatRepository.findByFlightId(flightId);
        
        boolean updated = false;
        for (Seat seat : seats) {
            if (seat.isLockExpired(LOCK_EXPIRATION_MINUTES)) {
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seat.setLockTime(null);
                seat.setLockedByUserId(null);
                updated = true;
            }
        }
        if (updated) {
            seatRepository.saveAll(seats);
        }

        return seats.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void selectOrLockSeats(Long flightId, List<String> seatNumbers, Long userId) {
        List<Seat> seats = seatRepository.findByFlightIdAndSeatNumberIn(flightId, seatNumbers);
        
        if (seats.size() != seatNumbers.size()) {
            throw new BadRequestException("Some requested seats do not exist on this flight");
        }

        LocalDateTime now = LocalDateTime.now();

        for (Seat seat : seats) {
            if (seat.getStatus() == Seat.SeatStatus.BOOKED) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " is already booked");
            }
            
            if (seat.getStatus() == Seat.SeatStatus.LOCKED 
                    && !seat.isLockExpired(LOCK_EXPIRATION_MINUTES)
                    && !seat.getLockedByUserId().equals(userId)) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " is currently locked by another user");
            }
            
            seat.setStatus(Seat.SeatStatus.LOCKED);
            seat.setLockTime(now);
            seat.setLockedByUserId(userId);
        }

        seatRepository.saveAll(seats);
    }

    @Transactional
    public void releaseSeats(Long flightId, List<String> seatNumbers) {
        List<Seat> seats = seatRepository.findByFlightIdAndSeatNumberIn(flightId, seatNumbers);
        for (Seat seat : seats) {
            if (seat.getStatus() == Seat.SeatStatus.LOCKED) {
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seat.setLockTime(null);
                seat.setLockedByUserId(null);
            }
        }
        seatRepository.saveAll(seats);
    }

    @Transactional
    public void releaseExpiredLocks() {
        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(LOCK_EXPIRATION_MINUTES);
        List<Seat> expiredSeats = seatRepository.findExpiredLocks(expiryTime);
        if (!expiredSeats.isEmpty()) {
            for (Seat seat : expiredSeats) {
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seat.setLockTime(null);
                seat.setLockedByUserId(null);
            }
            seatRepository.saveAll(expiredSeats);
        }
    }

    private SeatDTO mapToDTO(Seat seat) {
        return SeatDTO.builder()
                .id(seat.getId())
                .seatNumber(seat.getSeatNumber())
                .seatClass(seat.getSeatClass().name())
                .status(seat.getStatus().name())
                .flightId(seat.getFlight().getId())
                .lockedByUserId(seat.getLockedByUserId())
                .build();
    }
}
