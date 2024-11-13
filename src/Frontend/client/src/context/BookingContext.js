import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { AuthContext} from "./AuthContext";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, loading } = useContext(AuthContext) || {};

  const fetchAllBookings = useCallback(async () => {
    if(!isAuthenticated){
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await axios.get('/api/bookings',{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (Array.isArray(res.data)) {
        setAllBookings(res.data);
        setIsLoading(false);
      } else if (res.data && Array.isArray(res.data.bookings)) {
        setAllBookings(res.data.bookings);
        setIsLoading(false);
      } else {
        throw new Error('Unexpected data structure');
      }
    } catch (err) {
      if (error.response?.status === 401) {
        console.log('Please login to view bookings');
        setIsLoading(false);
        return;
      }
      console.error("Failed to fetch bookings", err);
      setError('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addBooking = useCallback((newBooking) => {
    setAllBookings(prevBookings => [...prevBookings, newBooking]);
  }, []);

  const updateBooking = useCallback((updatedBooking) => {
    setAllBookings(prevBookings => 
      prevBookings.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
  }, []);

  const deleteBooking = useCallback((bookingId) => {
    setAllBookings(prevBookings => 
      prevBookings.filter(booking => booking._id !== bookingId)
    );
  }, []);

  return (
    <BookingContext.Provider value={{ 
      allBookings, 
      setAllBookings, 
      fetchAllBookings, 
      addBooking,
      updateBooking,
      deleteBooking,
      isLoading,
      error
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);

export default BookingProvider;