package com.flightbooking.service;

import com.flightbooking.dto.FlightDTO;
import com.flightbooking.exception.ResourceNotFoundException;
import com.flightbooking.model.Flight;
import com.flightbooking.model.Seat;
import com.flightbooking.repository.FlightRepository;
import com.flightbooking.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {

    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;

    public FlightService(FlightRepository flightRepository, SeatRepository seatRepository) {
        this.flightRepository = flightRepository;
        this.seatRepository = seatRepository;
    }

    public List<FlightDTO> getAllFlights() {
        return flightRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public FlightDTO getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
        return mapToDTO(flight);
    }

    public List<FlightDTO> searchFlights(String source, String destination, LocalDate departureDate) {
        LocalDateTime startOfDay = departureDate.atStartOfDay();
        LocalDateTime endOfDay = departureDate.atTime(LocalTime.MAX);

        return flightRepository.searchFlights(source, destination, startOfDay, endOfDay).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FlightDTO createFlight(FlightDTO dto) {
        Flight flight = Flight.builder()
                .flightNumber(dto.getFlightNumber())
                .airline(dto.getAirline())
                .source(dto.getSource())
                .destination(dto.getDestination())
                .departureTime(dto.getDepartureTime())
                .arrivalTime(dto.getArrivalTime())
                .duration(dto.getDuration())
                .totalSeats(62)
                .availableSeats(62)
                .price(dto.getPrice())
                .build();

        Flight savedFlight = flightRepository.save(flight);
        generateSeatsForFlight(savedFlight);

        return mapToDTO(savedFlight);
    }

    @Transactional
    public FlightDTO updateFlight(Long id, FlightDTO dto) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));

        flight.setFlightNumber(dto.getFlightNumber());
        flight.setAirline(dto.getAirline());
        flight.setSource(dto.getSource());
        flight.setDestination(dto.getDestination());
        flight.setDepartureTime(dto.getDepartureTime());
        flight.setArrivalTime(dto.getArrivalTime());
        flight.setDuration(dto.getDuration());
        flight.setPrice(dto.getPrice());

        Flight updatedFlight = flightRepository.save(flight);
        return mapToDTO(updatedFlight);
    }

    @Transactional
    public void deleteFlight(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
        flightRepository.delete(flight);
    }

    private void generateSeatsForFlight(Flight flight) {
        List<Seat> seats = new ArrayList<>();
        String[] columns = {"A", "B", "C", "D", "E", "F"};

        for (int row = 1; row <= 2; row++) {
            for (String col : new String[]{"A", "B", "E", "F"}) {
                seats.add(Seat.builder()
                        .seatNumber(row + col)
                        .seatClass(Seat.SeatClass.BUSINESS)
                        .status(Seat.SeatStatus.AVAILABLE)
                        .flight(flight)
                        .build());
            }
        }

        for (int row = 3; row <= 4; row++) {
            for (String col : columns) {
                seats.add(Seat.builder()
                        .seatNumber(row + col)
                        .seatClass(Seat.SeatClass.PREMIUM_ECONOMY)
                        .status(Seat.SeatStatus.AVAILABLE)
                        .flight(flight)
                        .build());
            }
        }

        for (int row = 5; row <= 11; row++) {
            for (String col : columns) {
                seats.add(Seat.builder()
                        .seatNumber(row + col)
                        .seatClass(Seat.SeatClass.ECONOMY)
                        .status(Seat.SeatStatus.AVAILABLE)
                        .flight(flight)
                        .build());
            }
        }

        seatRepository.saveAll(seats);
        flight.setTotalSeats(seats.size());
        flight.setAvailableSeats(seats.size());
        flightRepository.save(flight);
    }

    public FlightDTO mapToDTO(Flight flight) {
        return FlightDTO.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .airline(flight.getAirline())
                .source(flight.getSource())
                .destination(flight.getDestination())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .duration(flight.getDuration())
                .totalSeats(flight.getTotalSeats())
                .availableSeats(flight.getAvailableSeats())
                .price(flight.getPrice())
                .build();
    }
}
