import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, bookingsAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { BookingsTable } from '../components/AdminTables';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadBookings = async () => {
    try {
      const data = await adminAPI.getBookings();
      setBookings(data);
    } catch (err) {
      showToast('Failed to load global bookings registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking as an Administrator? This will release seats.')) {
      return;
    }

    try {
      await bookingsAPI.cancel(id);
      showToast('Booking cancelled successfully', 'success');
      loadBookings();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to cancel booking';
      showToast(errMsg, 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.5rem' }}>
          <ArrowLeft size={14} />
          Back to Admin Panel
        </Link>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Manage Bookings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Review all global reservations, check passenger lists, or cancel trips.</p>
      </div>

      <BookingsTable
        bookings={bookings}
        onCancel={handleCancel}
      />

    </div>
  );
};

export default ManageBookings;

