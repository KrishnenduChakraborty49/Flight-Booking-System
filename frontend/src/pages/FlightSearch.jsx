import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { flightsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FlightSearchForm from '../components/FlightSearchForm';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Filter, SlidersHorizontal, AlertCircle } from 'lucide-react';

const FlightSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const travelClass = searchParams.get('travelClass') || 'ECONOMY';

  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedAirline, setSelectedAirline] = useState('ALL');
  const [sortBy, setSortBy] = useState('PRICE_ASC');

  useEffect(() => {
    const fetchFlights = async () => {
      if (!source || !destination || !departureDate) return;
      setLoading(true);
      try {
        const results = await flightsAPI.search(source, destination, departureDate);
        setFlights(results);
      } catch (err) {
        showToast('Failed to fetch flights', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [source, destination, departureDate]);

  const handleSearchSubmit = (newParams) => {
    setSearchParams(newParams);
  };

  const handleSelectFlight = (flightId) => {
    if (!user) {
      showToast('Please sign in to proceed with booking', 'info');
      navigate('/login', { state: { from: { pathname: '/flight/' + flightId + '/seats' } } });
    } else {
      navigate('/flight/' + flightId + '/seats?class=' + travelClass + '&passengers=' + passengers);
    }
  };

  const airlines = ['ALL', ...new Set(flights.map((f) => f.airline))];

  const filteredAndSortedFlights = flights
    .filter((f) => selectedAirline === 'ALL' || f.airline === selectedAirline)
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      if (sortBy === 'DEPARTURE_ASC') return new Date(a.departureTime) - new Date(b.departureTime);
      return 0;
    });

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Available Flights</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Schedules for <strong>{source}</strong> &rarr; <strong>{destination}</strong> on {new Date(departureDate).toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FlightSearchForm 
          onSearch={handleSearchSubmit} 
          initialValues={{ source, destination, departureDate, passengers, travelClass }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start' }}>
        {flights.length > 0 && (
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} style={{ color: '#818cf8' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Airline:</span>
                <select 
                  className="form-control" 
                  value={selectedAirline} 
                  onChange={(e) => setSelectedAirline(e.target.value)}
                  style={{ padding: '0.4rem 0.8rem', width: 'auto', fontSize: '0.85rem' }}
                >
                  {airlines.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={16} style={{ color: '#818cf8' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sort By:</span>
                <select 
                  className="form-control" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: '0.4rem 0.8rem', width: 'auto', fontSize: '0.85rem' }}
                >
                  <option value="PRICE_ASC">Lowest Price</option>
                  <option value="PRICE_DESC">Highest Price</option>
                  <option value="DEPARTURE_ASC">Earliest Departure</option>
                </select>
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Found {filteredAndSortedFlights.length} flight(s)
            </span>
          </div>
        )}

        <div>
          {loading ? (
            <LoadingSpinner />
          ) : filteredAndSortedFlights.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <AlertCircle size={48} style={{ color: '#f43f5e' }} />
              <div>
                <h3 style={{ margin: 0 }}>No Flights Found</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  There are no scheduled flights matching your criteria for this date.
                </p>
              </div>
            </div>
          ) : (
            filteredAndSortedFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                travelClass={travelClass}
                passengers={passengers}
                onSelect={handleSelectFlight}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default FlightSearch;

