import React from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Select, useToast, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBookings } from '../../hooks/useBookings';
import { updateBooking, deleteBooking } from '../../server/db';

const BookingManagement = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: bookingsData, isLoading, error, refetch } = useBookings();

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }) => updateBooking(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Booking Updated',
        description: 'The booking status has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Booking Deleted',
        description: 'The booking has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingMutation.mutate({ id: bookingId, status: newStatus });
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBookingMutation.mutate(bookingId);
    }
  };

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

  if (!bookingsData || bookingsData.data.length === 0) {
    return (
      <Box>
        <Alert status="info" mb={4}>
          <AlertIcon />
          No bookings found.
        </Alert>
        <Button onClick={() => refetch()}>Refresh</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Booking Management</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>User</Th>
            <Th>Service</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bookingsData.data.map((booking) => (
            <Tr key={booking.id}>
              <Td>{booking.id}</Td>
              <Td>{booking.users?.email}</Td>
              <Td>{booking.services?.name}</Td>
              <Td>
                <Select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BookingManagement;