import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  useToast,
} from '@chakra-ui/react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { processPayment } from '../../utils/paymentProcessing';

const PaymentWindow = ({ isOpen, onClose, onPaymentSubmit, totalCost }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe has not loaded. Please try again later.');
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      const paymentResult = await processPayment(totalCost, paymentMethod.id);

      if (paymentResult.success) {
        await onPaymentSubmit({ success: true, paymentMethodId: paymentMethod.id });
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: "Payment Error",
        description: err.message || "There was an error processing your payment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      await onPaymentSubmit({ success: false, error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment Information</ModalHeader>
        {!isProcessing && <ModalCloseButton />}
        <ModalBody>
          <VStack spacing={4}>
            <Box width="100%">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </Box>
            <Text fontWeight="bold">Total Cost: ${totalCost.toFixed(2)}</Text>
            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button 
            colorScheme="blue" 
            mr={3} 
            onClick={handleSubmit} 
            isLoading={isProcessing} 
            loadingText="Processing Payment"
            disabled={isProcessing || !stripe}
          >
            Process Payment
          </Button>
          {!isProcessing && (
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentWindow;