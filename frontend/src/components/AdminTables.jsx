import React from 'react';
import { Trash2, Edit, Ban, Download } from 'lucide-react';
import { bookingsAPI } from '../services/api';

export const FlightsTable = ({ flights, onEdit, onDelete }) => {
  const formatTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Flight #</th>
            <th>Airline</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Price</th>
            <th>Seats</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No flights scheduled.</td>
            </tr>
          ) : (
            flights.map((f) => (
              <tr key={f.id}>
                <td style={{ fontWeight: 700, color: '#818cf8' }}>{f.flightNumber}</td>
                <td>{f.airline}</td>
                <td>{f.source} &rarr; {f.destination}</td>
                <td>{formatTime(f.departureTime)}</td>
                <td>{formatTime(f.arrivalTime)}</td>
                <td style={{ fontWeight: 600, color: '#10b981' }}></td>
                <td>{f.availableSeats} / {f.totalSeats}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => onEdit(f)} style={{ padding: '0.4rem', borderRadius: '6px' }} title="Edit">
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-danger" onClick={() => onDelete(f.id)} style={{ padding: '0.4rem', borderRadius: '6px' }} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const BookingsTable = ({ bookings, onCancel }) => {
  const formatTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>PNR</th>
            <th>Customer</th>
            <th>Flight</th>
            <th>Route</th>
            <th>Booking Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found.</td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id}>
                <td style={{ fontWeight: 700, color: '#fbbf24' }}>{b.bookingReference}</td>
                <td>
                  <span style={{ display: 'block', fontWeight: 500 }}>{b.userFullName}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userEmail}</span>
                </td>
                <td>{b.airline} ({b.flightNumber})</td>
                <td>{b.source.split(' ')[0]} &rarr; {b.destination.split(' ')[0]}</td>
                <td>{formatTime(b.bookingDate)}</td>
                <td style={{ fontWeight: 600, color: '#10b981' }}></td>
                <td>
                  <span className={'badge badge-' + (b.bookingStatus === 'CONFIRMED' ? 'success' : b.bookingStatus === 'PENDING' ? 'pending' : 'danger')}>
                    {b.bookingStatus}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    {b.bookingStatus === 'CONFIRMED' && (
                      <a
                        href={bookingsAPI.getTicketUrl(b.id)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem', borderRadius: '6px' }}
                        title="Ticket"
                        download
                      >
                        <Download size={14} />
                      </a>
                    )}
                    {b.bookingStatus !== 'CANCELLED' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => onCancel(b.id)}
                        style={{ padding: '0.4rem', borderRadius: '6px' }}
                        title="Cancel"
                      >
                        <Ban size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const UsersTable = ({ users }) => {
  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No users registered.</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.phoneNumber || 'N/A'}</td>
                <td>
                  <span className={'badge badge-' + (u.role === 'ADMIN' ? 'danger' : 'success')}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

