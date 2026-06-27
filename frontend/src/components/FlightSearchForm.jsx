import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';

const FlightSearchForm = ({ onSearch, initialValues = {} }) => {
  const [source, setSource] = useState(initialValues.source || '');
  const [destination, setDestination] = useState(initialValues.destination || '');
  const [departureDate, setDepartureDate] = useState(initialValues.departureDate || '');
  const [passengers, setPassengers] = useState(initialValues.passengers || 1);
  const [travelClass, setTravelClass] = useState(initialValues.travelClass || 'ECONOMY');

  const airports = [
    'New York (JFK)',
    'Los Angeles (LAX)',
    'London (LHR)',
    'Paris (CDG)',
    'Dubai (DXB)',
    'Mumbai (BOM)',
    'Delhi (DEL)',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source || !destination || !departureDate) {
      alert('Please fill in all search details');
      return;
    }
    if (source === destination) {
      alert('Origin and destination cannot be the same');
      return;
    }
    onSearch({ source, destination, departureDate, passengers, travelClass });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            <MapPin size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
            From
          </label>
          <select
            className="form-control"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          >
            <option value="" disabled>Select Source</option>
            {airports.map((ap) => (
              <option key={ap} value={ap}>{ap}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            <MapPin size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
            To
          </label>
          <select
            className="form-control"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="" disabled>Select Destination</option>
            {airports.map((ap) => (
              <option key={ap} value={ap}>{ap}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
            Departure Date
          </label>
          <input
            type="date"
            className="form-control"
            value={departureDate}
            min={today}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            <Users size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
            Passengers
          </label>
          <input
            type="number"
            className="form-control"
            value={passengers}
            min="1"
            max="9"
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Class</label>
          <select
            className="form-control"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            required
          >
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
          </select>
        </div>

      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
        <Search size={18} />
        Search Flights
      </button>
    </form>
  );
};

export default FlightSearchForm;

