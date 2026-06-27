import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (fullName, email, password, phoneNumber) => {
    const response = await api.post('/api/auth/register', { fullName, email, password, phoneNumber });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },
};

export const flightsAPI = {
  getAll: async () => {
    const response = await api.get('/api/flights');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get('/api/flights/' + id);
    return response.data;
  },
  search: async (source, destination, departureDate) => {
    const response = await api.get('/api/flights/search', {
      params: { source, destination, departureDate },
    });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/flights', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put('/api/flights/' + id, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete('/api/flights/' + id);
    return response.data;
  },
};

export const seatsAPI = {
  getByFlight: async (flightId) => {
    const response = await api.get('/api/seats/flight/' + flightId);
    return response.data;
  },
  select: async (flightId, seatNumbers) => {
    const response = await api.put('/api/seats/select', { flightId, seatNumbers });
    return response.data;
  },
};

export const bookingsAPI = {
  create: async (flightId, passengers) => {
    const response = await api.post('/api/bookings', { flightId, passengers });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get('/api/bookings/' + id);
    return response.data;
  },
  getByUser: async () => {
    const response = await api.get('/api/bookings/user');
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.delete('/api/bookings/' + id);
    return response.data;
  },
  getTicketUrl: (id) => {
    return '/api/bookings/' + id + '/ticket';
  },
};

export const paymentsAPI = {
  process: async (paymentData) => {
    const response = await api.post('/api/payments', paymentData);
    return response.data;
  },
  getByBooking: async (bookingId) => {
    const response = await api.get('/api/payments/booking/' + bookingId);
    return response.data;
  },
};

export const adminAPI = {
  getAnalytics: async () => {
    const response = await api.get('/api/admin/analytics');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },
  getBookings: async () => {
    const response = await api.get('/api/admin/bookings');
    return response.data;
  },
};

export default api;
