import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { UsersTable } from '../components/AdminTables';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (err) {
      showToast('Failed to load registered users database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.5rem' }}>
          <ArrowLeft size={14} />
          Back to Admin Panel
        </Link>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Manage Users</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View and review registered passenger profiles and administrator credentials.</p>
      </div>

      <UsersTable users={users} />

    </div>
  );
};

export default ManageUsers;

