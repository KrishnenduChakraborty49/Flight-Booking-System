package com.flightbooking.service;

import com.flightbooking.dto.BookingDTO;
import com.flightbooking.dto.BookingRequest;
import com.flightbooking.dto.PassengerDTO;
import com.flightbooking.exception.BadRequestException;
import com.flightbooking.exception.ResourceNotFoundException;
import com.flightbooking.model.*;
import com.flightbooking.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository,
                          FlightRepository flightRepository, SeatRepository seatRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.flightRepository = flightRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional
    public BookingDTO createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        if (flight.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot book a flight that has already departed");
        }

        String pnr = generatePNR();

        Booking booking = Booking.builder()
                .bookingReference(pnr)
                .bookingDate(LocalDateTime.now())
                .bookingStatus(Booking.BookingStatus.PENDING)
                .user(user)
                .flight(flight)
                .passengers(new ArrayList<>())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Passenger> passengers = new ArrayList<>();

        for (PassengerDTO passengerDTO : request.getPassengers()) {
            Seat seat = seatRepository.findByFlightIdAndSeatNumber(flight.getId(), passengerDTO.getSeatNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Seat " + passengerDTO.getSeatNumber() + " not found on this flight"));

            if (seat.getStatus() == Seat.SeatStatus.BOOKED) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " is already booked");
            }

            if (seat.getStatus() == Seat.SeatStatus.LOCKED 
                    && seat.getLockedByUserId() != null 
                    && !seat.getLockedByUserId().equals(user.getId())
                    && !seat.isLockExpired(10)) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " is locked by another customer");
            }

            BigDecimal seatPrice = flight.getPrice();
            if (seat.getSeatClass() == Seat.SeatClass.BUSINESS) {
                seatPrice = seatPrice.multiply(new BigDecimal("2.0"));
            } else if (seat.getSeatClass() == Seat.SeatClass.PREMIUM_ECONOMY) {
                seatPrice = seatPrice.multiply(new BigDecimal("1.3"));
            }

            totalAmount = totalAmount.add(seatPrice);

            seat.setStatus(Seat.SeatStatus.LOCKED);
            seat.setLockTime(LocalDateTime.now());
            seat.setLockedByUserId(user.getId());
            seatRepository.save(seat);

            Passenger passenger = Passenger.builder()
                    .fullName(passengerDTO.getFullName())
                    .age(passengerDTO.getAge())
                    .gender(passengerDTO.getGender())
                    .passportNumber(passengerDTO.getPassportNumber())
                    .booking(booking)
                    .seat(seat)
                    .build();

            passengers.add(passenger);
        }

        booking.setPassengers(passengers);
        booking.setTotalAmount(totalAmount);

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDTO(savedBooking);
    }

    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapToDTO(booking);
    }

    public BookingDTO getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with PNR: " + reference));
        return mapToDTO(booking);
    }

    public List<BookingDTO> getBookingsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return bookingRepository.findByUserIdOrderByBookingDateDesc(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelBooking(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!booking.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Unauthorized to cancel this booking");
        }

        if (booking.getBookingStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        LocalDateTime departure = booking.getFlight().getDepartureTime();
        if (LocalDateTime.now().isAfter(departure.minusHours(2))) {
            throw new BadRequestException("Bookings can only be cancelled up to 2 hours before departure time");
        }

        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);

        List<Seat> seats = new ArrayList<>();
        for (Passenger passenger : booking.getPassengers()) {
            Seat seat = passenger.getSeat();
            if (seat != null) {
                seat.setStatus(Seat.SeatStatus.AVAILABLE);
                seat.setLockTime(null);
                seat.setLockedByUserId(null);
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);

        Flight flight = booking.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + booking.getPassengers().size());
        flightRepository.save(flight);

        bookingRepository.save(booking);
    }

    private String generatePNR() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random rnd = new Random();
        while (sb.length() < 6) {
            int index = (int) (rnd.nextFloat() * chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }

    public BookingDTO mapToDTO(Booking booking) {
        List<BookingDTO.PassengerDetail> passengerDetails = booking.getPassengers().stream()
                .map(p -> BookingDTO.PassengerDetail.builder()
                        .id(p.getId())
                        .fullName(p.getFullName())
                        .age(p.getAge())
                        .gender(p.getGender())
                        .passportNumber(p.getPassportNumber())
                        .seatNumber(p.getSeat() != null ? p.getSeat().getSeatNumber() : null)
                        .seatClass(p.getSeat() != null ? p.getSeat().getSeatClass().name() : null)
                        .build())
                .collect(Collectors.toList());

        return BookingDTO.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .bookingDate(booking.getBookingDate())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus().name())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userEmail(booking.getUser() != null ? booking.getUser().getEmail() : null)
                .userFullName(booking.getUser() != null ? booking.getUser().getFullName() : null)
                .flightId(booking.getFlight().getId())
                .flightNumber(booking.getFlight().getFlightNumber())
                .airline(booking.getFlight().getAirline())
                .source(booking.getFlight().getSource())
                .destination(booking.getFlight().getDestination())
                .departureTime(booking.getFlight().getDepartureTime())
                .arrivalTime(booking.getFlight().getArrivalTime())
                .passengers(passengerDetails)
                .build();
    }
}

