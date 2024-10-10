import axios from 'axios';

export const createBooking = async (bookingData) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.post('/api/bookings/create-booking', bookingData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        retries++;
      } else {
        throw error;
      }
    }
  }

  throw new Error('Failed to create booking after multiple attempts');
};