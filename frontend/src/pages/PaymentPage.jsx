import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsAPI, paymentsAPI } from '../services/api';
import { useToast } from '../components/Toast';
import BookingSummaryCard from '../components/BookingSummaryCard';
import PaymentForm from '../components/PaymentForm';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingsAPI.getById(bookingId);
        setBooking(data);
      } catch (err) {
        showToast('Failed to load reservation details', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePaymentSubmit = async (paymentData) => {
    setPaymentLoading(true);
    try {
      const data = {
        ...paymentData,
        bookingId: parseInt(bookingId),
      };
      
      await paymentsAPI.process(data);
      showToast('Payment successful! Boarding pass issued.', 'success');
      navigate('/booking-confirm/' + bookingId);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Payment processing failed. Please check credentials.';
      showToast(errMsg, 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const cardPassengers = booking.passengers.map((p) => ({
    fullName: p.fullName,
    age: p.age,
    gender: p.gender,
    passportNumber: p.passportNumber,
    seatNumber: p.seatNumber,
  }));

  const cardFlight = {
    airline: booking.airline,
    flightNumber: booking.flightNumber,
    source: booking.source,
    destination: booking.destination,
    departureTime: booking.departureTime,
    arrivalTime: booking.arrivalTime,
    duration: 'Flight details',
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Secure Checkout</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Complete payment to confirm your seat reservations.</p>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'start' }}>
        
        <div>
          <BookingSummaryCard
            flight={cardFlight}
            passengers={cardPassengers}
            totalAmount={booking.totalAmount}
          />
        </div>

        <div>
          <PaymentForm
            amount={booking.totalAmount}
            onSubmit={handlePaymentSubmit}
            loading={paymentLoading}
          />
        </div>

      </div>

    </div>
  );
};

export default PaymentPage;

