import { supabase } from '../../supabase';

export const mfaHelpers = {
  enroll: async (factorType: string) => {
    const { data, error } = await supabase.auth.mfa.enroll({ factorType });
    if (error) throw error;
    return data;
  },
  challenge: async (factorId: string) => {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) throw error;
    return data;
  },
  verify: async (factorId: string, challengeId: string, code: string) => {
    const { data, error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
    if (error) throw error;
    return data;
  }
};