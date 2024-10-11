import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, Text, VStack, Heading } from '@chakra-ui/react';
import LoadingSpinner from '../common/LoadingSpinner';
import useNotification from '../../hooks/useNotification';
import BookingForm from './BookingForm';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const showNotification = useNotification();

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const fetchBookings = async (page) => {
    setIsLoading(true);
    try {
      // Replace this with actual API call
      // const response = await fetch(`/api/bookings?page=${page}&limit=${itemsPerPage}`);
      // const data = await response.json();
      const data = {
        bookings: Array.from({ length: itemsPerPage }, (_, i) => ({
          id: i + 1 + (page - 1) * itemsPerPage,
          customerName: `Customer ${i + 1}`,
          service: `Service ${i + 1}`,
          date: new Date().toISOString(),
          status: ['Confirmed', 'Pending', 'Cancelled'][Math.floor(Math.random() * 3)],
        })),
        totalPages: 5,
      };
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
      showNotification('Success', 'Bookings fetched successfully', 'success');
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showNotification('Error', 'Failed to fetch bookings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddBooking = (newBooking) => {
    // Replace this with actual API call to add a new booking
    setBookings([...bookings, { ...newBooking, id: bookings.length + 1 }]);
    showNotification('Success', 'Booking added successfully', 'success');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="md" mb={4}>Add New Booking</Heading>
        <BookingForm onSubmit={handleAddBooking} />
      </Box>
      <Box>
        <Heading size="md" mb={4}>Bookings</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Customer Name</Th>
              <Th>Service</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>{booking.id}</Td>
                <Td>{booking.customerName}</Td>
                <Td>{booking.service}</Td>
                <Td>{new Date(booking.date).toLocaleDateString()}</Td>
                <Td>{booking.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <HStack mt={4} justify="center">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};

export default BookingManagement;