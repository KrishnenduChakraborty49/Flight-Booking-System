import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { User, Mail, Lock, Phone, Loader } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(fullName, email, password, phoneNumber);
      showToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create account. Email may be in use.';
      showToast(errMsg, 'error');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
      <div className="glass-card" style={{ maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Create Account</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sign up to start searching and booking flights</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <User size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Mail size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. user@flight.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. +1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Lock size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
              Password (Min 6 characters)
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? (
              <>
                <Loader size={18} className="spinner" style={{ animationDuration: '1s' }} />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>Sign in here</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;

