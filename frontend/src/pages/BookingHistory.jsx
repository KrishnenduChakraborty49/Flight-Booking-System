import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Download, CreditCard, ChevronRight, Ban, AlertCircle } from 'lucide-react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const data = await bookingsAPI.getByUser();
      setBookings(data);
    } catch (err) {
      showToast('Failed to load your booking history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this flight booking? This will immediately release your reserved seats.')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      showToast('Flight cancelled successfully. Refund initiated.', 'success');
      fetchBookings();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to cancel booking. Cancellations are only allowed up to 2 hours before departure.';
      showToast(errMsg, 'error');
    }
  };

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
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>My Trips</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your upcoming flights or review past trips.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {bookings.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={48} style={{ color: 'var(--text-muted)' }} />
            <div>
              <h3 style={{ margin: 0 }}>No Bookings Yet</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                You have not booked any flights. Search and select a destination to take your first trip!
              </p>
            </div>
          </div>
        ) : (
          bookings.map((b) => {
            const isUpcoming = b.bookingStatus === 'CONFIRMED' && new Date(b.departureTime) > new Date();
            const isPending = b.bookingStatus === 'PENDING';

            return (
              <div key={b.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>PNR / Ref:</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.05em' }}>{b.bookingReference}</span>
                  </div>
                  <span className={'badge badge-' + (b.bookingStatus === 'CONFIRMED' ? 'success' : b.bookingStatus === 'PENDING' ? 'pending' : 'danger')}>
                    {b.bookingStatus}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      {b.source} &rarr; {b.destination}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
                      Departure: {formatDateTime(b.departureTime)}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Airline: {b.airline} ({b.flightNumber})
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Paid</span>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}></span>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Seats: {b.passengers.map((p) => p.seatNumber).join(', ')}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(3,7,18,0.3)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Passengers:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    {b.passengers.map((p) => (
                      <span key={p.id} style={{ fontSize: '0.85rem' }}>
                        {p.fullName} <code style={{ color: '#818cf8', fontWeight: 700 }}>({p.seatNumber})</code>
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  {isPending && (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/payment/' + b.id)}
                    >
                      <CreditCard size={14} />
                      Complete Checkout
                      <ChevronRight size={14} />
                    </button>
                  )}
                  {b.bookingStatus === 'CONFIRMED' && (
                    <a
                      href={bookingsAPI.getTicketUrl(b.id)}
                      className="btn btn-secondary"
                      download
                    >
                      <Download size={14} />
                      Download Boarding Pass
                    </a>
                  )}
                  {isUpcoming && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancel(b.id)}
                    >
                      <Ban size={14} />
                      Cancel Booking
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default BookingHistory;

