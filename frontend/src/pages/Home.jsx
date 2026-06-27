import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlightSearchForm from '../components/FlightSearchForm';
import { Compass, Award, ShieldCheck } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (searchParams) => {
    const params = new URLSearchParams(searchParams);
    navigate('/search?' + params.toString());
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '3rem 1.5rem' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Discover the Skies
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, background: 'linear-gradient(135deg, #fff 40%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Next Journey Begins Here
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Explore flights, select your preferred cabin seats with instant locks, and fly with our premium global network.
        </p>
      </div>

      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        <FlightSearchForm onSearch={handleSearchSubmit} />
      </div>

      <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '0.75rem', borderRadius: '50%' }}>
            <Compass size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Explore Routes</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Find schedules connecting major cities around the globe with direct flight routes.</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '0.75rem', borderRadius: '50%' }}>
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Cabin Luxury</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose Economy, Premium Economy, or Business class seating for ultimate travel luxury.</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', padding: '0.75rem', borderRadius: '50%' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Instant Locking</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Seats are temporarily locked during checkout, guaranteeing your selection is safe from double booking.</p>
        </div>
      </div>

    </div>
  );
};

export default Home;

