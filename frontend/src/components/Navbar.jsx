import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, LogOut, LayoutDashboard, History, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Plane size={24} style={{ transform: 'rotate(45deg)', color: '#818cf8' }} />
        <span>Comet Airways</span>
      </Link>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} end>
          Home
        </NavLink>
        
        {user && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <History size={16} />
              My Trips
            </NavLink>
          </>
        )}

        {user && user.role === 'ADMIN' && (
          <NavLink to="/admin" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            <Settings size={16} />
            Admin Portal
          </NavLink>
        )}
      </div>

      <div className="nav-user">
        {user ? (
          <>
            <Link to="/profile" className="nav-link" style={{ gap: '0.5rem' }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.9rem' }}>{user.fullName}</span>
            </Link>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <LogOut size={14} />
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

