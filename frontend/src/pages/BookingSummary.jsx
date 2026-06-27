import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { flightsAPI, bookingsAPI } from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronRight, UserPlus } from 'lucide-react';

const BookingSummary = () => {
  const { flightId } = useParams();
  const [searchParams] = useSearchParams();
  const seatNumbers = (searchParams.get('seats') || '').split(',');
  const travelClass = searchParams.get('class') || 'ECONOMY';
  const passengerCount = parseInt(searchParams.get('passengers') || '1');

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [passengers, setPassengers] = useState(
    seatNumbers.map((s) => ({
      fullName: '',
      age: '',
      gender: '',
      passportNumber: '',
      seatNumber: s,
    }))
  );

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const data = await flightsAPI.getById(flightId);
        setFlight(data);
      } catch (err) {
        showToast('Failed to load flight details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [flightId]);

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  let multiplier = 1.0;
  if (travelClass === 'BUSINESS') multiplier = 2.0;
  else if (travelClass === 'PREMIUM_ECONOMY') multiplier = 1.3;

  const basePrice = flight ? parseFloat(flight.price) : 0;
  const seatPrice = basePrice * multiplier;
  const totalAmount = seatPrice * passengerCount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    for (const p of passengers) {
      if (!p.fullName.trim() || !p.age || !p.gender) {
        showToast('Please fill in name, age, and gender for all passengers', 'warning');
        return;
      }
    }

    setBookingLoading(true);
    try {
      const formattedPassengers = passengers.map((p) => ({
        ...p,
        age: parseInt(p.age),
      }));

      const booking = await bookingsAPI.create(flightId, formattedPassengers);
      showToast('Reservation registered! Proceeding to payment...', 'success');
      navigate('/payment/' + booking.id);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create booking. Seat locks may have expired.';
      showToast(errMsg, 'error');
      navigate('/flight/' + flightId + '/seats?class=' + travelClass + '&passengers=' + passengerCount);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Passenger Details</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Enter details for each ticket selection below.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid-cols-2" style={{ alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {passengers.map((p, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserPlus size={18} style={{ color: '#818cf8' }} />
                  Passenger #{idx + 1}
                </span>
                <span className="badge badge-success">Seat {p.seatNumber}</span>
              </h3>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name (as in ID)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={p.fullName}
                  onChange={(e) => handlePassengerChange(idx, 'fullName', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 30"
                    min="0"
                    max="120"
                    value={p.age}
                    onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    value={p.gender}
                    onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                    required
                  >
                    <option value="" disabled>Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Passport Number (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. A12345678"
                  value={p.passportNumber}
                  onChange={(e) => handlePassengerChange(idx, 'passportNumber', e.target.value)}
                />
              </div>

            </div>
          ))}
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              Fare Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Base Fare per Ticket:</span>
                <span></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Class Surcharge:</span>
                <span>
                  {travelClass === 'BUSINESS' ? 'Business (+100%)' : travelClass === 'PREMIUM_ECONOMY' ? 'Premium Econ (+30%)' : 'Economy (+0%)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fare per Ticket:</span>
                <span></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Quantity:</span>
                <span>x {passengerCount}</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Total Amount</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Incl. tax)</span>
            </div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
              
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={bookingLoading}
          >
            {bookingLoading ? 'Registering Booking...' : 'Proceed to Checkout'}
            <ChevronRight size={16} />
          </button>
        </div>

      </form>

    </div>
  );
};

export default BookingSummary;

