import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useToast } from '@chakra-ui/react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    try {
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({
        title: 'Sign up successful',
        description: 'Please check your email to verify your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return user;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const signIn = async (email, password) => {
    try {
      const { user, error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
      return user;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const enrollMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const verifyMFA = async (factorId, code) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({ factorId, code });
      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return { user, loading, signUp, signIn, signOut, enrollMFA, verifyMFA };
};