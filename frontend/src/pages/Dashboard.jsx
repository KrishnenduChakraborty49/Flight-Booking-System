import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Plane, History, User, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const bookings = await bookingsAPI.getByUser();
        const activeUpcoming = bookings
          .filter((b) => b.bookingStatus === 'CONFIRMED' && new Date(b.departureTime) > new Date())
          .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime))[0];
        
        setUpcomingTrip(activeUpcoming);
      } catch (err) {
        showToast('Failed to load trips history', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

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
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(17, 24, 39, 0.6) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Hello, {user?.fullName}!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your flight dashboard. Ready for your next destination?</p>
        </div>
        <Link to="/" className="btn btn-primary">
          <Plane size={16} />
          Book A Flight
        </Link>
      </div>

      <div className="grid-cols-2">
        
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} style={{ color: '#818cf8' }} />
            Your Next Trip
          </h3>

          {loading ? (
            <LoadingSpinner />
          ) : upcomingTrip ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{upcomingTrip.source.split(' ')[0]} &rarr; {upcomingTrip.destination.split(' ')[0]}</span>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>PNR: {upcomingTrip.bookingReference}</span>
                </div>
                <span className="badge badge-success">{upcomingTrip.bookingStatus}</span>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(3,7,18,0.4)', borderRadius: '8px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Flight:</span>
                  <span style={{ fontWeight: 600 }}>{upcomingTrip.airline} ({upcomingTrip.flightNumber})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Departure:</span>
                  <span style={{ fontWeight: 600 }}>{formatDateTime(upcomingTrip.departureTime)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Seats:</span>
                  <span style={{ fontWeight: 600, color: '#fbbf24' }}>
                    {upcomingTrip.passengers.map((p) => p.seatNumber).join(', ')}
                  </span>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => navigate('/booking-confirm/' + upcomingTrip.id)}
              >
                <ExternalLink size={14} />
                View Boarding Pass
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
              <Plane size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.95rem' }}>No upcoming trips scheduled.</p>
              <Link to="/" style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>
                Search flight destinations now
              </Link>
            </div>
          )}
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: 0 }}>
            Account Operations
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
            <Link to="/history" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '1rem' }}>
              <History size={18} style={{ color: '#818cf8', marginRight: '0.5rem' }} />
              <div>
                <span style={{ display: 'block', fontWeight: 600, textAlign: 'left' }}>Trips & History</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>View all active and completed bookings</span>
              </div>
            </Link>

            <Link to="/profile" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '1rem' }}>
              <User size={18} style={{ color: '#818cf8', marginRight: '0.5rem' }} />
              <div>
                <span style={{ display: 'block', fontWeight: 600, textAlign: 'left' }}>My Profile</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>Manage your name, contact, and passwords</span>
              </div>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;

