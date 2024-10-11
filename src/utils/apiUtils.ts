import { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@chakra-ui/react';

export const handleApiError = (error: PostgrestError | null) => {
  if (error) {
    console.error('API Error:', error);
    toast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
};

export const wrapApiCall = async <T>(apiCall: () => Promise<{ data: T | null; error: PostgrestError | null }>) => {
  try {
    const { data, error } = await apiCall();
    if (error) {
      handleApiError(error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return null;
  }
};