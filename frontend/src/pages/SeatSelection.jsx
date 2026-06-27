import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { flightsAPI, seatsAPI } from '../services/api';
import { useToast } from '../components/Toast';
import SeatMap from '../components/SeatMap';
import LoadingSpinner from '../components/LoadingSpinner';
import { Armchair, ChevronRight } from 'lucide-react';

const SeatSelection = () => {
  const { flightId } = useParams();
  const [searchParams] = useSearchParams();
  const travelClass = searchParams.get('class') || 'ECONOMY';
  const passengerCount = parseInt(searchParams.get('passengers') || '1');

  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFlightData = async () => {
      try {
        const flightData = await flightsAPI.getById(flightId);
        const seatData = await seatsAPI.getByFlight(flightId);
        setFlight(flightData);
        setSeats(seatData);
      } catch (err) {
        showToast('Failed to load flight or seat map', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadFlightData();
  }, [flightId]);

  const handleSeatClick = (seatNumber) => {
    const seatObj = seats.find((s) => s.seatNumber === seatNumber);
    if (!seatObj) return;

    if (seatObj.seatClass !== travelClass) {
      showToast('Please select a seat matching your travel class: ' + travelClass, 'warning');
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= passengerCount) {
        showToast('You can only select up to ' + passengerCount + ' seat(s) for this booking', 'warning');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleConfirmSeats = async () => {
    if (selectedSeats.length !== passengerCount) {
      showToast('Please select exactly ' + passengerCount + ' seat(s)', 'warning');
      return;
    }

    setLocking(true);
    try {
      await seatsAPI.select(flightId, selectedSeats);
      showToast('Seats temporarily locked for booking!', 'success');
      navigate('/flight/' + flightId + '/booking-summary?seats=' + selectedSeats.join(',') + '&class=' + travelClass + '&passengers=' + passengerCount);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'One of the selected seats is no longer available. Refreshing layout...';
      showToast(errMsg, 'error');
      
      const seatData = await seatsAPI.getByFlight(flightId);
      setSeats(seatData);
      setSelectedSeats([]);
    } finally {
      setLocking(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Select Seating</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Choose {passengerCount} seat(s) in <strong>{travelClass.replace('_', ' ')}</strong> class for your trip to {flight?.destination.split(' ')[0]}.
          </p>
        </div>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'start' }}>
        
        <div>
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            maxSelectable={passengerCount}
          />
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              Selection Info
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Flight:</span>
                <span style={{ fontWeight: 600 }}>{flight?.airline} ({flight?.flightNumber})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Class:</span>
                <span style={{ fontWeight: 600, color: '#818cf8' }}>{travelClass.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Passengers:</span>
                <span style={{ fontWeight: 600 }}>{passengerCount}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Selected Seats</h4>
            {selectedSeats.length === 0 ? (
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Click seats in the cabin layout to select
              </p>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedSeats.map((s) => (
                  <span key={s} className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                    <Armchair size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Seating Surcharges</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {travelClass === 'BUSINESS' ? 'Business Class: 2.0x base fare' : travelClass === 'PREMIUM_ECONOMY' ? 'Premium Economy: 1.3x base fare' : 'Economy Class: Standard fare'}
            </span>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleConfirmSeats}
            disabled={selectedSeats.length !== passengerCount || locking}
          >
            {locking ? 'Locking Seats...' : 'Confirm Seating & Continue'}
            <ChevronRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default SeatSelection;

