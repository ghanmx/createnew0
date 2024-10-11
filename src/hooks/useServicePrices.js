import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';

const fetchServicePrices = async () => {
  const { data, error } = await supabase
    .from('service_prices')
    .select('*');

  if (error) throw error;
  return data;
};

export const useServicePrices = () => {
  return useQuery(['servicePrices'], fetchServicePrices, {
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
