import React from 'react';
import { Plane, Clock } from 'lucide-react';

const FlightCard = ({ flight, travelClass = 'ECONOMY', passengers = 1, onSelect }) => {
  let multiplier = 1.0;
  if (travelClass === 'BUSINESS') {
    multiplier = 2.0;
  } else if (travelClass === 'PREMIUM_ECONOMY') {
    multiplier = 1.3;
  }

  const basePrice = parseFloat(flight.price);
  const ticketPrice = basePrice * multiplier;
  const totalPrice = ticketPrice * passengers;

  const formatTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleDateString([], { day: '2-digit', month: 'short' });
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '0.5rem',
            borderRadius: '10px',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Plane size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{flight.airline}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{flight.flightNumber}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatTime(flight.departureTime)}</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatDate(flight.departureTime)}</span>
            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>{flight.source.split(' ')[0]}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 0.5 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} />
              {flight.duration}
            </span>
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', margin: '0.5rem 0' }}>
              <div style={{
                position: 'absolute',
                top: '-3px',
                right: '50%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#6366f1',
              }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Non-stop</span>
          </div>

          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatTime(flight.arrivalTime)}</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatDate(flight.arrivalTime)}</span>
            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>{flight.destination.split(' ')[0]}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right', minWidth: '150px' }}>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {passengers} x 
          </span>
          <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
            
          </span>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {flight.availableSeats} seats left
          </span>
          
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', width: '100%' }}
            onClick={() => onSelect(flight.id)}
            disabled={flight.availableSeats < passengers}
          >
            {flight.availableSeats < passengers ? 'Sold Out' : 'Select Seats'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;

