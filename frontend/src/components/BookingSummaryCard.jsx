import React from 'react';
import { User } from 'lucide-react';

const BookingSummaryCard = ({ flight, passengers, totalAmount }) => {
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
          Flight Details
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Flight:</span>
            <span style={{ fontWeight: 600 }}>{flight.airline} ({flight.flightNumber})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Route:</span>
            <span style={{ fontWeight: 600 }}>{flight.source} to {flight.destination}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Departure:</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatDateTime(flight.departureTime)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Arrival:</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatDateTime(flight.arrivalTime)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Duration:</span>
            <span>{flight.duration}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '1.05rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          <User size={16} style={{ marginRight: '6px', verticalAlign: 'middle', color: '#818cf8' }} />
          Passengers
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {passengers.map((p, idx) => (
            <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>{p.fullName || 'Passenger ' + (idx + 1)}</span>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Seat {p.seatNumber}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Age: {p.age || 'N/A'}</span>
                <span>Gender: {p.gender || 'N/A'}</span>
                {p.passportNumber && <span>Passport: {p.passportNumber}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Total Amount</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Incl. taxes & classes)</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
            
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryCard;

