import React, { useState } from 'react';
import { CreditCard, Smartphone, Landmark, Loader } from 'lucide-react';

const PaymentForm = ({ amount, onSubmit, loading }) => {
  const [method, setMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setExpiryDate(val);
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.substring(0, 3);
    setCvv(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const paymentData = {
      paymentId: Date.now(),
      bookingId: 0,
      paymentMethod: method,
      amount: parseFloat(amount),
      cardNumber: cleanCardNumber,
      cvv,
      expiryDate,
      upiId,
    };
    onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: 0 }}>
        Payment
      </h3>

      <div style={{ display: 'flex', background: 'rgba(3,7,18,0.5)', padding: '4px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
        <button
          type="button"
          onClick={() => setMethod('CARD')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            background: method === 'CARD' ? 'var(--primary-glow)' : 'transparent',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <CreditCard size={16} />
          Card
        </button>
        <button
          type="button"
          onClick={() => setMethod('UPI')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            background: method === 'UPI' ? 'var(--primary-glow)' : 'transparent',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <Smartphone size={16} />
          UPI
        </button>
        <button
          type="button"
          onClick={() => setMethod('NET_BANKING')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            background: method === 'NET_BANKING' ? 'var(--primary-glow)' : 'transparent',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <Landmark size={16} />
          Net Banking
        </button>
      </div>

      <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', fontSize: '0.8rem', color: '#a5b4fc' }}>
        <strong>Testing:</strong> Enter card number with <code>0000</code> or UPI with <code>fail</code> to simulate a failed transaction. Other credentials will succeed.
      </div>

      {method === 'CARD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid rgba(255,255,255,0.1)',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>CREDIT CARD</span>
              <CreditCard size={28} style={{ color: 'rgba(255,255,255,0.8)' }} />
            </div>
            
            <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.15em', margin: '1.5rem 0', color: '#fff', textAlign: 'center' }}>
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'block' }}>CARD HOLDER</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{cardName.toUpperCase() || 'YOUR NAME'}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'block' }}>EXPIRES</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{expiryDate || 'MM/YY'}</span>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Name on Card</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Card Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Expiry Date</label>
              <input
                type="text"
                className="form-control"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">CVV</label>
              <input
                type="password"
                className="form-control"
                placeholder="•••"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
            </div>
          </div>
        </div>
      )}

      {method === 'UPI' && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">UPI ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. user@okaxis"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
          />
        </div>
      )}

      {method === 'NET_BANKING' && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Select Bank</label>
          <select
            className="form-control"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            required
          >
            <option value="" disabled>Choose your Bank</option>
            <option value="COMET_BANK">Comet Savings Bank</option>
            <option value="ANTIGRAVITY_BANK">Antigravity Trust Bank</option>
            <option value="NATIONAL_FED_BANK">National Federal Bank</option>
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
        {loading ? (
          <>
            <Loader size={18} className="spinner" style={{ animationDuration: '1s' }} />
            Processing...
          </>
        ) : (
          'Pay $' + parseFloat(amount).toFixed(2)
        )}
      </button>
    </form>
  );
};

export default PaymentForm;


