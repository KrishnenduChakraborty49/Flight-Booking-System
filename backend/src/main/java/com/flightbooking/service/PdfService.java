package com.flightbooking.service;

import com.flightbooking.dto.BookingDTO;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateTicketPdf(BookingDTO booking) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.DARK_GRAY);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.GRAY);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.BLACK);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font boldTextFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font alertFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.RED);

            Paragraph title = new Paragraph("FLIGHT BOARDING PASS & E-TICKET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph pnrText = new Paragraph("Booking PNR: " + booking.getBookingReference() + " | Status: " + booking.getBookingStatus(), alertFont);
            pnrText.setAlignment(Element.ALIGN_CENTER);
            pnrText.setSpacingBefore(5);
            pnrText.setSpacingAfter(15);
            document.add(pnrText);

            Paragraph flightSec = new Paragraph("Flight Details", sectionFont);
            flightSec.setSpacingAfter(5);
            document.add(flightSec);

            PdfPTable flightTable = new PdfPTable(2);
            flightTable.setWidthPercentage(100);
            flightTable.setSpacingAfter(15);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm");

            addCell(flightTable, "Flight Number:", boldTextFont);
            addCell(flightTable, booking.getAirline() + " (" + booking.getFlightNumber() + ")", textFont);
            addCell(flightTable, "Route:", boldTextFont);
            addCell(flightTable, booking.getSource() + " -> " + booking.getDestination(), textFont);
            addCell(flightTable, "Departure:", boldTextFont);
            addCell(flightTable, booking.getDepartureTime().format(formatter), textFont);
            addCell(flightTable, "Arrival:", boldTextFont);
            addCell(flightTable, booking.getArrivalTime().format(formatter), textFont);

            document.add(flightTable);

            Paragraph passSec = new Paragraph("Passenger Details", sectionFont);
            passSec.setSpacingAfter(5);
            document.add(passSec);

            PdfPTable passengerTable = new PdfPTable(4);
            passengerTable.setWidthPercentage(100);
            passengerTable.setSpacingAfter(15);

            addHeaderCell(passengerTable, "Passenger Name", boldTextFont);
            addHeaderCell(passengerTable, "Age", boldTextFont);
            addHeaderCell(passengerTable, "Gender", boldTextFont);
            addHeaderCell(passengerTable, "Seat Assignment", boldTextFont);

            for (BookingDTO.PassengerDetail p : booking.getPassengers()) {
                addCell(passengerTable, p.getFullName(), textFont);
                addCell(passengerTable, String.valueOf(p.getAge()), textFont);
                addCell(passengerTable, p.getGender(), textFont);
                addCell(passengerTable, p.getSeatNumber() + " (" + p.getSeatClass() + ")", textFont);
            }

            document.add(passengerTable);

            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setSpacingBefore(10);
            
            addCell(summaryTable, "Total Fare Paid:", boldTextFont);
            addCell(summaryTable, "$" + booking.getTotalAmount().toString(), textFont);
            addCell(summaryTable, "E-ticket Issued On:", boldTextFont);
            addCell(summaryTable, booking.getBookingDate().format(formatter), textFont);

            document.add(summaryTable);

            Paragraph footer = new Paragraph("\n* Please carry a valid Photo ID card at the airport checkout.\n* Gates close 45 minutes before departure.", subtitleFont);
            footer.setAlignment(Element.ALIGN_LEFT);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    private void addCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(6);
        cell.setBorderColor(Color.LIGHT_GRAY);
        table.addCell(cell);
    }

    private void addHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(6);
        cell.setBackgroundColor(new Color(240, 240, 240));
        cell.setBorderColor(Color.GRAY);
        table.addCell(cell);
    }
}
