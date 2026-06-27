package com.flightbooking.repository;

import com.flightbooking.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByFlightId(Long flightId);
    
    List<Seat> findByFlightIdAndSeatNumberIn(Long flightId, List<String> seatNumbers);

    @Query("SELECT s FROM Seat s WHERE s.status = 'LOCKED' AND s.lockTime < :expiryTime")
    List<Seat> findExpiredLocks(@Param("expiryTime") LocalDateTime expiryTime);
    
    Optional<Seat> findByFlightIdAndSeatNumber(Long flightId, String seatNumber);
}
