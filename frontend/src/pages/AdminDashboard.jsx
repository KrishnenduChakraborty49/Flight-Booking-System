import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plane, DollarSign, Users, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminAPI.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        showToast('Failed to load admin analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Administrator Control Panel</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of flight operations, sales, bookings, and user accounts.</p>
      </div>

      <div className="admin-stats-grid">
        
        <div className="glass-card stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="stat-label">Total Flights</div>
            <div className="stat-val">{analytics?.totalFlights}</div>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '0.75rem', borderRadius: '12px' }}>
            <Plane size={24} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="stat-label">Total Bookings</div>
            <div className="stat-val">{analytics?.totalBookings}</div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', padding: '0.75rem', borderRadius: '12px' }}>
            <ClipboardList size={24} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="stat-label">Revenue Collected</div>
            <div className="stat-val"></div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '12px' }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="stat-label">Registered Customers</div>
            <div className="stat-val">{analytics?.totalUsers}</div>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '0.75rem', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
        </div>

      </div>

      <div className="grid-cols-3">
        
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Schedule & Flights</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add, delete, update flight departures, arrivals, routing, and ticket price configurations.</p>
          <Link to="/admin/flights" className="btn btn-primary" style={{ marginTop: 'auto' }}>
            Manage Flights &rarr;
          </Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Bookings & Tickets</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monitor all reservations made on Pinnacle Airways. Force cancellations and print e-tickets.</p>
          <Link to="/admin/bookings" className="btn btn-primary" style={{ marginTop: 'auto' }}>
            Manage Bookings &rarr;
          </Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Customer Registry</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>View registered users, monitor customer contact credentials, and review user accounts.</p>
          <Link to="/admin/users" className="btn btn-primary" style={{ marginTop: 'auto' }}>
            Manage Users &rarr;
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;

