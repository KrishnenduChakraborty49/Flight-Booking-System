import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { flightsAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { FlightsTable } from '../components/AdminTables';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const { showToast } = useToast();

  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  const loadFlights = async () => {
    try {
      const data = await flightsAPI.getAll();
      setFlights(data);
    } catch (err) {
      showToast('Failed to load flights schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const resetForm = () => {
    setFlightNumber('');
    setAirline('');
    setSource('');
    setDestination('');
    setDepartureTime('');
    setArrivalTime('');
    setDuration('');
    setPrice('');
    setEditingFlight(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (flight) => {
    setEditingFlight(flight);
    setFlightNumber(flight.flightNumber);
    setAirline(flight.airline);
    setSource(flight.source);
    setDestination(flight.destination);
    
    const depDateStr = new Date(flight.departureTime).toISOString().slice(0, 16);
    const arrDateStr = new Date(flight.arrivalTime).toISOString().slice(0, 16);
    setDepartureTime(depDateStr);
    setArrivalTime(arrDateStr);
    
    setDuration(flight.duration);
    setPrice(flight.price.toString());
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flight? This will delete all seats and active bookings!')) {
      return;
    }
    try {
      await flightsAPI.delete(id);
      showToast('Flight deleted successfully', 'success');
      loadFlights();
    } catch (err) {
      showToast('Failed to delete flight', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (source === destination) {
      showToast('Origin and destination cannot be the same', 'warning');
      return;
    }

    const payload = {
      flightNumber,
      airline,
      source,
      destination,
      departureTime: new Date(departureTime).toISOString(),
      arrivalTime: new Date(arrivalTime).toISOString(),
      duration,
      price: parseFloat(price),
    };

    try {
      if (editingFlight) {
        await flightsAPI.update(editingFlight.id, payload);
        showToast('Flight updated successfully!', 'success');
      } else {
        await flightsAPI.create(payload);
        showToast('Flight created & seats generated!', 'success');
      }
      setShowModal(false);
      resetForm();
      loadFlights();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to save flight schedule';
      showToast(errMsg, 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} />
            Back to Admin Panel
          </Link>
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Manage Flights</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Add new departures, update timetables, or remove routes.</p>
        </div>
        
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Create Flight Route
        </button>
      </div>

      <FlightsTable
        flights={flights}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(3,7,18,0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 110,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
        }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>{editingFlight ? 'Edit Flight Details' : 'Schedule New Flight'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Flight Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. EK-502"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Airline Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Emirates"
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Source Airport</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Paris (CDG)"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Destination Airport</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Dubai (DXB)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Arrival Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 6h 45m"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Base Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 299"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} />
                  {editingFlight ? 'Save Changes' : 'Publish Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageFlights;

