import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

const UserRow = React.memo(({ user }) => (
  <Tr>
    <Td>{user.id}</Td>
    <Td>{user.name}</Td>
    <Td>{user.email}</Td>
    <Td>{user.role}</Td>
    <Td>{user.status}</Td>
  </Tr>
));

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const showNotification = useNotification();

  const fetchUsers = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace this with actual API call
      // const response = await fetch(`/api/users?page=${page}&limit=${itemsPerPage}`);
      // if (!response.ok) throw new Error('Failed to fetch users');
      // const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API delay
      const data = {
        users: Array.from({ length: itemsPerPage }, (_, i) => ({
          id: i + 1 + (page - 1) * itemsPerPage,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: ['Admin', 'User'][Math.floor(Math.random() * 2)],
          status: ['Active', 'Inactive'][Math.floor(Math.random() * 2)],
        })),
        totalPages: 5,
      };
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const fetchUsers = async (page) => {
    setIsLoading(true);
    try {
      // Replace this with actual API call
      // const response = await fetch(`/api/users?page=${page}&limit=${itemsPerPage}`);
      // const data = await response.json();
      const data = {
        users: Array.from({ length: itemsPerPage }, (_, i) => ({
          id: i + 1 + (page - 1) * itemsPerPage,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: ['Admin', 'User'][Math.floor(Math.random() * 2)],
          status: ['Active', 'Inactive'][Math.floor(Math.random() * 2)],
        })),
        totalPages: 5,
      };
      setUsers(data.users);
      setTotalPages(data.totalPages);
      showNotification('Success', 'Users fetched successfully', 'success');
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error', 'Failed to fetch users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };[];

  const paginationControls = useMemo(() => (
    <HStack mt={4} justify="center">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1 || isLoading}
      >
        Previous
      </Button>
      <Text>
        Page {currentPage} of {totalPages}
      </Text>
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages || isLoading}
      >
        Next
      </Button>
    </HStack>
  ), [currentPage, totalPages, handlePageChange, isLoading]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </Tbody>
      </Table>
      {paginationControls}
    </Box>
  );
};

export default React.memo(UserManagement);
