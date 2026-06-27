package com.flightbooking.service;

import com.flightbooking.dto.BookingDTO;
import com.flightbooking.dto.PaymentRequest;
import com.flightbooking.exception.BadRequestException;
import com.flightbooking.exception.ResourceNotFoundException;
import com.flightbooking.model.*;
import com.flightbooking.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final FlightRepository flightRepository;
    private final EmailService emailService;
    private final BookingService bookingService;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository,
                          SeatRepository seatRepository, FlightRepository flightRepository,
                          EmailService emailService, BookingService bookingService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.flightRepository = flightRepository;
        this.emailService = emailService;
        this.bookingService = bookingService;
    }

    @Transactional
    public Payment processPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (booking.getBookingStatus() == Booking.BookingStatus.CONFIRMED) {
            throw new BadRequestException("Booking has already been paid for and confirmed");
        }

        if (booking.getBookingStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot pay for a cancelled booking");
        }

        boolean isSuccess = true;
        if (request.getPaymentMethod().equalsIgnoreCase("UPI") && request.getUpiId() != null && request.getUpiId().contains("fail")) {
            isSuccess = false;
        } else if (request.getCardNumber() != null && request.getCardNumber().contains("0000")) {
            isSuccess = false;
        }

        String transactionId = "TXN-" + UUID.randomUUID().toString().toUpperCase().substring(0, 12);

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .transactionId(transactionId)
                .build();

        if (isSuccess) {
            payment.setPaymentStatus(Payment.PaymentStatus.SUCCESS);
            booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);

            List<Seat> seatsToSave = new ArrayList<>();
            for (Passenger passenger : booking.getPassengers()) {
                Seat seat = passenger.getSeat();
                if (seat != null) {
                    seat.setStatus(Seat.SeatStatus.BOOKED);
                    seat.setLockTime(null);
                    seat.setLockedByUserId(null);
                    seatsToSave.add(seat);
                }
            }
            seatRepository.saveAll(seatsToSave);

            Flight flight = booking.getFlight();
            flight.setAvailableSeats(flight.getAvailableSeats() - booking.getPassengers().size());
            flightRepository.save(flight);

            bookingRepository.save(booking);
            paymentRepository.save(payment);

            BookingDTO bookingDTO = bookingService.mapToDTO(booking);
            emailService.sendBookingConfirmationEmail(bookingDTO);
        } else {
            payment.setPaymentStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BadRequestException("Payment transaction failed. Please check details and try again.");
        }

        return payment;
    }

    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment details not found for booking: " + bookingId));
    }
}
