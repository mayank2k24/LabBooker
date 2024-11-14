import axios from 'axios';

export  async function createBooking(bookingData) {
  console.log('Attempting to create booking with data:', bookingData);
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.post('/api/bookings/create-booking', bookingData);
      console.log('Booking created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createBooking:', error.response?.data || error.message);
      if (error.response && error.response.status === 409) {
        console.log(`Retry attempt ${retries + 1} due to conflict`);
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        retries++;
      } else {
        throw error;
      }
    }
  }

  throw new Error('Failed to create booking after multiple attempts');
}

export default createBooking;

