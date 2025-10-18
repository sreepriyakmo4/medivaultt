import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password, role) => {
    try {
      // First, try to find existing user with exact username match
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      // If user doesn't exist, create new user
      if (findError && findError.code === 'PGRST116') {
        // Insert into users table
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            { 
              username: username, 
              password: password, 
              role: role, 
              name: username
            }
          ])
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        // Insert into role-specific table
        if (role === 'doctor') {
          await supabase
            .from('doctors')
            .insert([
              { 
                user_id: newUser.id,
                specialization: 'General Medicine',
                consultation_fee: 150.00
              }
            ]);
        } else if (role === 'patient') {
          await supabase
            .from('patients')
            .insert([
              { 
                user_id: newUser.id
              }
            ]);
        }

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true, user: newUser, isNewUser: true };
      } 
      
      // If user exists, check password
      else if (existingUser) {
        if (existingUser.password === password) {
          setUser(existingUser);
          localStorage.setItem('user', JSON.stringify(existingUser));
          return { success: true, user: existingUser, isNewUser: false };
        } else {
          return { success: false, error: 'Invalid password' };
        }
      }
      
      // Other errors
      else if (findError) {
        throw findError;
      }

    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}