import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { authAPI } from '../services/api';
import UserProfileCard from '../components/UserProfileCard';

const UserProfile = () => {
  const { user, updateProfileState } = useAuth();
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const handleProfileUpdate = async (profileData) => {
    setUpdating(true);
    try {
      const updated = await authAPI.updateProfile(profileData);
      updateProfileState(updated);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>My Account</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View and update your personal information.</p>
      </div>

      {user && (
        <UserProfileCard
          user={user}
          onUpdate={handleProfileUpdate}
          loading={updating}
        />
      )}
    </div>
  );
};

export default UserProfile;

