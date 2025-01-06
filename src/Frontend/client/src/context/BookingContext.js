import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [allBookings, setAllBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookingsByDate = async (labId, date) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings/${labId}/${date}`);
      return response.data || [];
    } catch (err) {
      toast.error('Failed to fetch bookings');
      console.error('Fetch error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const fetchAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookings');
      setAllBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (bookingData) => {
    try {
      const response = await axios.post('/api/bookings/create-booking', bookingData);
      setAllBookings(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  }, []);

  const updateBooking = async (bookingId, updatedData) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/bookings/${bookingId}`, updatedData);
      await fetchAllBookings();
      toast.success('Booking updated successfully');
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider value={{
      allBookings,
      activeBookings,
      selectedBooking,
      loading,
      error,
      setSelectedBooking,
      fetchBookingsByDate,
      createBooking,
      updateBooking,
      fetchAllBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);