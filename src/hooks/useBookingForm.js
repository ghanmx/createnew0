import { useReducer, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { getSupabase } from '../../supabase';
import { wrapApiCall } from '../utils/apiUtils';

const initialState = {
  formData: {},
  distance: 0,
  totalCost: 0,
  isPaymentWindowOpen: false,
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_DISTANCE':
      return { ...state, distance: action.payload };
    case 'SET_TOTAL_COST':
      return { ...state, totalCost: action.payload };
    case 'SET_PAYMENT_WINDOW':
      return { ...state, isPaymentWindowOpen: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export const useBookingForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FORM_DATA', payload: { [name]: value } });
  }, []);

  const handleDateTimeChange = useCallback((date) => {
    dispatch({ type: 'SET_FORM_DATA', payload: { pickupDateTime: date } });
  }, []);

  const handleBookingProcess = useCallback(async (bookingData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const supabase = getSupabase();

    const result = await wrapApiCall(() => supabase
      .from('bookings')
      .insert([bookingData])
      .select()
    );

    dispatch({ type: 'SET_LOADING', payload: false });

    if (result) {
      toast({
        title: "Booking Successful",
        description: "Your booking has been confirmed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      dispatch({ type: 'SET_PAYMENT_WINDOW', payload: true });
    }
  }, [toast]);

  const saveDraft = useCallback(async (draftData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const supabase = getSupabase();

    const result = await wrapApiCall(() => supabase
      .from('booking_drafts')
      .insert([draftData])
      .select()
    );

    dispatch({ type: 'SET_LOADING', payload: false });

    if (result) {
      toast({
        title: "Draft Saved",
        description: "Your booking draft has been saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  return {
    ...state,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    saveDraft,
    setDistance: (distance) => dispatch({ type: 'SET_DISTANCE', payload: distance }),
    setTotalCost: (cost) => dispatch({ type: 'SET_TOTAL_COST', payload: cost }),
    setIsPaymentWindowOpen: (isOpen) => dispatch({ type: 'SET_PAYMENT_WINDOW', payload: isOpen }),
  };
};