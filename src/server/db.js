import { createClient } from '@supabase/supabase-js';
import config from './config/config.js';
import rateLimit from 'express-rate-limit';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

const handleSupabaseError = async (operation) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      console.error('Supabase error:', error);
      retries++;
      if (retries === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

export const getUsers = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .order('email');
    
    if (error) throw error;
    return data;
  });
};

export const updateUser = async (id, userData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  });
};

export const getBookings = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select(`
        id,
        created_at,
        status,
        total_cost,
        user:users(id, email),
        service:services(id, name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw error;
    return { data, count: count || 0, totalPages: Math.ceil((count || 0) / limit) };
  });
};

export const createBooking = async (bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();
    
    if (error) throw error;
    return data[0];
  });
};

export const updateBooking = async (id, bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  });
};

export const deleteBooking = async (id) => {
  return handleSupabaseError(async () => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  });
};

export const deleteUser = async (id) => {
  return handleSupabaseError(async () => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  });
};


export const createAccount = async (email, password, userData) => {
  return handleSupabaseError(async () => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes('For security purposes, you can only request this after')) {
        throw new Error('Too many signup attempts. Please try again later.');
      }
      throw authError;
    }

    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ ...userData, user_id: authData.user.id }])
        .select();

      if (profileError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      // Create a new entry in the 'users' table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, email: email, role: 'user' }])
        .select();

      if (userError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      return { user: userData[0], profile: profileData[0] };
    }
  });
};

export const login = async (email, password) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please try again.');
      }
      throw error;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;


    return { session: data.session, user: userData };
  });
};

// Rate limiting middleware
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

export const setupRealtimeSubscription = (table, onUpdate) => {
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table: table }, (payload) => {
      onUpdate(payload);
    })
    .subscribe();
};

export const subscribeToBookings = (callback) => {
  return setupRealtimeSubscription('bookings', callback);
};

export const subscribeToUsers = (callback) => {
  return setupRealtimeSubscription('users', callback);
};

export const subscribeToProfiles = (callback) => {
  return setupRealtimeSubscription('profiles', callback);
};

// ... keep existing code
