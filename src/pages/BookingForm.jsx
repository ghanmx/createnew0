import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase";
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import FloatingForm from '../components/FloatingForm';
import PaymentWindow from '../components/PaymentWindow';
import { getTowTruckType, calculateTotalCost } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';
import { sendAdminNotification } from '../utils/adminNotification';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { v4 as uuidv4 } from 'uuid';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    phoneNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    vehicleSize: '',
    pickupAddress: '',
    dropOffAddress: '',
    vehicleIssue: '',
    additionalDetails: '',
    wheelsStatus: '',
    pickupDateTime: new Date(),
    paymentMethod: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedTowTruck, setSelectedTowTruck] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateTimeChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      pickupDateTime: date
    }));
  };

  const handlePaymentSubmit = (paymentData) => {
    // Implement payment submission logic here
    console.log('Payment submitted:', paymentData);
    setIsPaymentWindowOpen(false);
    // Proceed with booking after successful payment
    handleBookingProcess();
  };

  const handleBookingProcess = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (!session && !isTestMode) {
        navigate('/login', { state: { from: '/booking' } });
        return;
      }

      const paymentResult = await processPayment(totalCost, isTestMode, formData);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }

      const dynamicKey = uuidv4();
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .insert({
          user_id: session?.user?.id || 'test_user',
          dynamic_key: dynamicKey,
          status: isTestMode ? 'test_mode' : 'pending',
        })
        .select('id, service_number')
        .single();

      if (serviceError) throw serviceError;

      const bookingData = {
        ...formData,
        distance,
        totalCost,
        towTruckType: selectedTowTruck,
        status: isTestMode ? 'test_mode' : 'pending',
        serviceId: serviceData.id,
        serviceNumber: serviceData.service_number,
        dynamicKey,
        createdAt: new Date().toISOString(),
        isTestMode,
      };

      const { data, error } = await supabase.from('bookings').insert([bookingData]);
      if (error) throw error;

      await sendAdminNotification(formData, totalCost, isTestMode);

      toast({
        title: isTestMode ? 'Test Booking Successful' : 'Booking Successful',
        description: `Your tow service has been ${isTestMode ? 'test ' : ''}booked successfully. Service number: ${serviceData.service_number}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/confirmation', { state: { bookingData, isTestMode } });
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

  // ... (rest of the component code)

  return (
  return (
    <Box position="relative" height="100vh" width="100vw">
      <GoogleMapsRoute
        setPickupAddress={(address) => setFormData({ ...formData, pickupAddress: address })}
        setDropOffAddress={(address) => setFormData({ ...formData, dropOffAddress: address })}
        setDistance={setDistance}
        setTotalCost={setTotalCost}
        selectedTowTruck={selectedTowTruck}
      />
      <FloatingForm
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleDateTimeChange={handleDateTimeChange}
        handleBookingProcess={handleBookingProcess}
        isLoading={isLoading}
        isTestMode={isTestMode}
        setIsTestMode={setIsTestMode}
        selectedTowTruck={selectedTowTruck}
        totalCost={totalCost}
      />
      <PaymentWindow
        isOpen={isPaymentWindowOpen}
        onClose={() => setIsPaymentWindowOpen(false)}
        onPaymentSubmit={handlePaymentSubmit}
        totalCost={totalCost}
        isTestMode={isTestMode}
      />
    </Box>
  );
};

export default BookingForm;