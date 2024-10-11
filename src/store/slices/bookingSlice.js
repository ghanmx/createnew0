import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (page) => {
    // Replace with actual API call
    const response = await fetch(`/api/bookings?page=${page}`);
    return response.json();
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload.bookings;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default bookingSlice.reducer;