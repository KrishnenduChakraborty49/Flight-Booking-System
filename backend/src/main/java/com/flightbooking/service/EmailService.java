package com.flightbooking.service;

import com.flightbooking.dto.BookingDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Value("${app.email.simulated-folder}")
    private String simulatedFolder;

    public void sendBookingConfirmationEmail(BookingDTO booking) {
        String pnr = booking.getBookingReference();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm");

        StringBuilder passengerRows = new StringBuilder();
        for (BookingDTO.PassengerDetail p : booking.getPassengers()) {
            passengerRows.append("<tr>")
                    .append("<td style='padding: 8px; border-bottom: 1px solid #ddd;'>").append(p.getFullName()).append("</td>")
                    .append("<td style='padding: 8px; border-bottom: 1px solid #ddd;'>").append(p.getAge()).append("</td>")
                    .append("<td style='padding: 8px; border-bottom: 1px solid #ddd;'>").append(p.getGender()).append("</td>")
                    .append("<td style='padding: 8px; border-bottom: 1px solid #ddd;'>").append(p.getSeatNumber()).append(" (").append(p.getSeatClass()).append(")</td>")
                    .append("</tr>");
        }

        String emailHtml = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
                        .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-top: 5px solid #0056b3; }
                        h2 { color: #0056b3; margin-top: 0; }
                        .pnr-box { background: #e6f0fa; padding: 15px; border-radius: 4px; font-size: 18px; font-weight: bold; margin: 15px 0; text-align: center; border: 1px dashed #0056b3; }
                        .details-table { width: 100%%; border-collapse: collapse; margin: 15px 0; }
                        .details-table th { text-align: left; padding: 8px; background: #f8f9fa; border-bottom: 2px solid #ddd; }
                        .footer { margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>Flight Booking Confirmed!</h2>
                        <p>Dear Customer,</p>
                        <p>Thank you for choosing us. Your flight booking has been successfully confirmed. Below are your booking details:</p>
                        
                        <div class='pnr-box'>
                            Booking Reference (PNR): %s
                        </div>
                        
                        <h3>Flight Information</h3>
                        <table class='details-table'>
                            <tr><td><strong>Airline:</strong></td><td>%s</td></tr>
                            <tr><td><strong>Flight Number:</strong></td><td>%s</td></tr>
                            <tr><td><strong>Route:</strong></td><td>%s to %s</td></tr>
                            <tr><td><strong>Departure:</strong></td><td>%s</td></tr>
                            <tr><td><strong>Arrival:</strong></td><td>%s</td></tr>
                            <tr><td><strong>Total Paid:</strong></td><td>$%s</td></tr>
                        </table>
                        
                        <h3>Passenger & Seating Layout</h3>
                        <table class='details-table' style='border: 1px solid #ddd;'>
                            <thead>
                                <tr style='background: #f8f9fa;'>
                                    <th style='padding: 8px; border-bottom: 2px solid #ddd;'>Name</th>
                                    <th style='padding: 8px; border-bottom: 2px solid #ddd;'>Age</th>
                                    <th style='padding: 8px; border-bottom: 2px solid #ddd;'>Gender</th>
                                    <th style='padding: 8px; border-bottom: 2px solid #ddd;'>Seat</th>
                                </tr>
                            </thead>
                            <tbody>
                                %s
                            </tbody>
                        </table>
                        
                        <p>Please print your boarding pass and display it along with photo identity proof during check-in.</p>
                        
                        <div class='footer'>
                            This is a simulated email confirmation for project demonstration.<br/>
                            Flight Booking System &copy; 2026. All rights reserved.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                        pnr,
                        booking.getAirline(),
                        booking.getFlightNumber(),
                        booking.getSource(), booking.getDestination(),
                        booking.getDepartureTime().format(formatter),
                        booking.getArrivalTime().format(formatter),
                        booking.getTotalAmount().toString(),
                        passengerRows.toString()
                );

        try {
            File dir = new File(simulatedFolder);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            File emailFile = new File(dir, "booking_pnr_" + pnr + ".html");
            try (FileWriter writer = new FileWriter(emailFile)) {
                writer.write(emailHtml);
            }
        } catch (IOException e) {
            System.err.println("Failed to write simulated email file: " + e.getMessage());
        }
    }
}
