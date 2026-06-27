package com.flightbooking.controller;

import com.flightbooking.dto.BookingDTO;
import com.flightbooking.dto.BookingRequest;
import com.flightbooking.service.BookingService;
import com.flightbooking.service.PdfService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final PdfService pdfService;

    public BookingController(BookingService bookingService, PdfService pdfService) {
        this.bookingService = bookingService;
        this.pdfService = pdfService;
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(Principal principal, @Valid @RequestBody BookingRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        BookingDTO booking = bookingService.createBooking(request, principal.getName());
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/user")
    public ResponseEntity<List<BookingDTO>> getBookingsByUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(bookingService.getBookingsByUser(principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(Principal principal, @PathVariable Long id) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        bookingService.cancelBooking(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/ticket")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable Long id) {
        BookingDTO booking = bookingService.getBookingById(id);
        byte[] pdfBytes = pdfService.generateTicketPdf(booking);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ticket_" + booking.getBookingReference() + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
