import React, { useState } from 'react';
import { User, Phone, Mail, Shield, Save } from 'lucide-react';

const UserProfileCard = ({ user, onUpdate, loading }) => {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ fullName, phoneNumber });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: 0 }}>
        Personal Profile
      </h3>

      <div className="form-group">
        <label className="form-label">
          <User size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
          Full Name
        </label>
        <input
          type="text"
          className="form-control"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <Mail size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
          Email Address (Login ID)
        </label>
        <input
          type="email"
          className="form-control"
          value={user.email}
          disabled
          style={{ background: 'rgba(255,255,255,0.02)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
          Phone Number
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="+1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <Shield size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#818cf8' }} />
          Account Permission Role
        </label>
        <span className="badge badge-success" style={{ display: 'inline-block' }}>{user.role}</span>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        <Save size={16} />
        {loading ? 'Saving Updates...' : 'Update Details'}
      </button>
    </form>
  );
};

export default UserProfileCard;

