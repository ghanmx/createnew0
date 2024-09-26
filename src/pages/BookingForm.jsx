import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase';
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import { getTowTruckType, calculateTotalCost } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    phoneNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    vehicleSize: '',
    pickupAddress: '',
    dropOffAddress: '',
    vehicleIssue: '',
    additionalDetails: '',
    wheelsStatus: '',
    pickupDate: '',
    pickupTime: '',
    paymentMethod: '',
  });

  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTowTruck, setSelectedTowTruck] = useState('A');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const towTruckType = getTowTruckType(formData.vehicleSize);
    setSelectedTowTruck(towTruckType);
  }, [formData.vehicleSize]);

  useEffect(() => {
    const newTotalCost = calculateTotalCost(distance, selectedTowTruck);
    setTotalCost(newTotalCost);
  }, [selectedTowTruck, distance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ['serviceType', 'userName', 'phoneNumber', 'vehicleMake', 'vehicleModel', 'vehicleColor', 'licensePlate', 'vehicleSize', 'pickupAddress', 'dropOffAddress', 'vehicleIssue', 'wheelsStatus', 'pickupDate', 'pickupTime', 'paymentMethod'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: 'Error',
          description: `Please fill in all required fields. Missing: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    }
    return true;
  };

  const handleBookingProcess = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Process payment
      const paymentResult = await processPayment(totalCost * 100); // Convert to cents

      if (!paymentResult.success) {
        console.error('Payment failed:', paymentResult.error);
        toast({
          title: 'Payment Failed',
          description: paymentResult.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const bookingData = {
        ...formData,
        distance,
        totalCost,
        towTruckType: selectedTowTruck,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('bookings').insert([bookingData]);

      if (error) throw error;

      toast({
        title: 'Booking Successful',
        description: 'Your tow service has been booked successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/confirmation', { state: { bookingData } });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" mb={4}>Booking Form</Heading>
        <form onSubmit={handleBookingProcess}>
          <FormControl id="serviceType" isRequired>
            <FormLabel>Service Type</FormLabel>
            <Select name="serviceType" value={formData.serviceType} onChange={handleChange}>
              <option value="">Select Service Type</option>
              <option value="Tow">Tow</option>
              <option value="Platform">Platform</option>
              <option value="Roadside Assistance">Roadside Assistance</option>
            </Select>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>User Name</FormLabel>
            <Input type="text" name="userName" value={formData.userName} onChange={handleChange} />
          </FormControl>
          <FormControl id="phoneNumber" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleMake" isRequired>
            <FormLabel>Vehicle Make</FormLabel>
            <Input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleModel" isRequired>
            <FormLabel>Vehicle Model</FormLabel>
            <Input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleColor" isRequired>
            <FormLabel>Vehicle Color</FormLabel>
            <Input type="text" name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} />
          </FormControl>
          <FormControl id="licensePlate" isRequired>
            <FormLabel>License Plate</FormLabel>
            <Input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleSize" isRequired>
            <FormLabel>Vehicle Size</FormLabel>
            <Select name="vehicleSize" value={formData.vehicleSize} onChange={handleChange}>
              <option value="">Select Vehicle Size</option>
              <option value="Small">Small (up to 3500 kg)</option>
              <option value="Medium">Medium (3501 - 6000 kg)</option>
              <option value="Large">Large (6001 - 12000 kg)</option>
              <option value="Extra Large">Extra Large (12001 - 25000 kg)</option>
            </Select>
          </FormControl>
          <FormControl id="pickupAddress" isRequired>
            <FormLabel>Pickup Address</FormLabel>
            <Input type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} />
          </FormControl>
          <FormControl id="dropOffAddress" isRequired>
            <FormLabel>Drop-off Address</FormLabel>
            <Input type="text" name="dropOffAddress" value={formData.dropOffAddress} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleIssue" isRequired>
            <FormLabel>Vehicle Issue</FormLabel>
            <Input type="text" name="vehicleIssue" value={formData.vehicleIssue} onChange={handleChange} />
          </FormControl>
          <FormControl id="additionalDetails">
            <FormLabel>Additional Details</FormLabel>
            <Textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} />
          </FormControl>
          <FormControl id="wheelsStatus" isRequired>
            <FormLabel>Wheels Status</FormLabel>
            <Select name="wheelsStatus" value={formData.wheelsStatus} onChange={handleChange}>
              <option value="">Select Wheels Status</option>
              <option value="Wheels Turn">Wheels Turn</option>
              <option value="Wheels Don't Turn">Wheels Don't Turn</option>
            </Select>
          </FormControl>
          <FormControl id="pickupDate" isRequired>
            <FormLabel>Pickup Date</FormLabel>
            <Input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} />
          </FormControl>
          <FormControl id="pickupTime" isRequired>
            <FormLabel>Pickup Time</FormLabel>
            <Input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
          </FormControl>
          <FormControl id="paymentMethod" isRequired>
            <FormLabel>Payment Method</FormLabel>
            <Select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="">Select Payment Method</option>
              <option value="Credit/Debit Card">Credit/Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Select>
          </FormControl>
          <GoogleMapsRoute setDistance={setDistance} setTotalCost={setTotalCost} selectedTowTruck={selectedTowTruck} />
          <Text mt={4}>Selected Tow Truck Type: {selectedTowTruck}</Text>
          <Text>Estimated Total Cost: ${totalCost.toFixed(2)}</Text>
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            Book Now
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default BookingForm;
