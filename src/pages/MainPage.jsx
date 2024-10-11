import React from 'react';
import { Box, Button, Heading, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MainPage = () => {
  const { user } = useAuth();

  return (
    <Box maxWidth="800px" margin="auto" padding="20px">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Tow Service Booking System
        </Heading>
        <Button as={Link} to="/booking" colorScheme="blue">
          Book a Tow
        </Button>
        {user && user.role === 'admin' && (
          <Button as={Link} to="/admin" colorScheme="green">
            Admin Panel
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default MainPage;