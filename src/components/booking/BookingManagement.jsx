import React from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Alert, AlertIcon, Button } from "@chakra-ui/react";
import { useBookings } from '../../hooks/useBookings';

const BookingManagement = ({ showNotification }) => {
  const { data: bookingsData, isLoading, error, refetch } = useBookings();

  if (isLoading) return <Box>Loading bookings...</Box>;
  
  if (error) {
    return (
      <Box>
        <Alert status="error" mb={4}>
          <AlertIcon />
          Error loading bookings: {error.message}
        </Alert>
        <Button onClick={() => refetch()}>Try Again</Button>
      </Box>
    );
  }

  if (!bookingsData || !Array.isArray(bookingsData.data)) {
    return (
      <Alert status="error">
        <AlertIcon />
        Invalid booking data format. Please contact support.
      </Alert>
    );
  }

  const bookings = bookingsData.data;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Booking Management</Heading>
      {bookings.length === 0 ? (
        <Text>No bookings found.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Booking ID</Th>
              <Th>User Email</Th>
              <Th>Service Name</Th>
              <Th>Status</Th>
              <Th>Payment Status</Th>
              <Th>Total Cost</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>{booking.id}</Td>
                <Td>{booking.user?.email || 'N/A'}</Td>
                <Td>{booking.service?.name || 'N/A'}</Td>
                <Td>{booking.status}</Td>
                <Td>{booking.payment_status}</Td>
                <Td>${booking.total_cost}</Td>
                <Td>{new Date(booking.created_at).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default BookingManagement;