import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle2, Download, AlertTriangle, Home } from 'lucide-react';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingsAPI.getById(bookingId);
        setBooking(data);
      } catch (err) {
        showToast('Failed to load booking info', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '3rem 1.5rem' }}>
      
      <div className="glass-card" style={{
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, rgba(17, 24, 39, 0.6) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={64} />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', margin: 0, color: '#fff' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Have a safe and pleasant flight on Pinnacle Airways.</p>
        </div>

        <div style={{
          background: 'rgba(3, 7, 18, 0.6)',
          border: '1px dashed #10b981',
          borderRadius: '8px',
          padding: '1rem 2rem',
          margin: '0.5rem 0',
        }}>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>BOOKING REFERENCE (PNR)</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.15em' }}>
            {booking.bookingReference}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <a
            href={bookingsAPI.getTicketUrl(bookingId)}
            className="btn btn-primary"
            style={{ flex: 1 }}
            download
          >
            <Download size={16} />
            Download Boarding Pass (PDF)
          </a>
        </div>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: 0 }}>
          Ticket Specifications
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Flight:</span>
            <span style={{ fontWeight: 600 }}>{booking.airline} ({booking.flightNumber})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Route:</span>
            <span style={{ fontWeight: 600 }}>{booking.source} &rarr; {booking.destination}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Departure:</span>
            <span style={{ fontWeight: 600 }}>{formatDateTime(booking.departureTime)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Paid:</span>
            <span style={{ fontWeight: 700, color: '#10b981' }}></span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
          <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Passenger Boarding Assignments:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {booking.passengers.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                <span>{p.fullName} (Age: {p.age})</span>
                <span style={{ fontWeight: 700, color: '#fbbf24' }}>Seat {p.seatNumber} ({p.seatClass})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        padding: '1rem',
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '12px',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'start'
      }}>
        <AlertTriangle size={24} style={{ color: '#fbbf24', flexShrink: 0 }} />
        <div>
          <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#fef3c7' }}>Email Simulation Alert</span>
          <span style={{ display: 'block', fontSize: '0.8rem', color: '#fbbf24', marginTop: '0.25rem' }}>
            A confirmation boarding pass email has been simulated and saved to:
            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '4px', display: 'block', margin: '4px 0', fontSize: '0.75rem' }}>
              backend/sent_emails/booking_pnr_{booking.bookingReference}.html
            </code>
            Open this HTML file in your browser to inspect the formatted email notification.
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to="/dashboard" className="btn btn-secondary">
          <Home size={16} />
          Go to Dashboard
        </Link>
      </div>

    </div>
  );
};

export default BookingConfirmation;

