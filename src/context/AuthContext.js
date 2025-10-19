// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // minimal user object persisted
  const [loading, setLoading] = useState(true);

  // load persisted user on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('medi_user');
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to parse persisted user', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistUser = (u) => {
    if (!u) {
      localStorage.removeItem('medi_user');
      setUser(null);
      return;
    }
    const minimal = {
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      role: u.role
    };
    localStorage.setItem('medi_user', JSON.stringify(minimal));
    setUser(minimal);
  };

  // LOGIN: do NOT create a user here. Accept username or email as identifier.
  const login = async (identifier, password) => {
    try {
      if (!identifier || !password) {
        return { success: false, error: 'Missing credentials' };
      }

      // search by username OR email
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.eq.${identifier},email.eq.${identifier}`)
        .limit(1)
        .maybeSingle();

      if (error) {
        // database error
        console.error('login find error', error);
        return { success: false, error: error.message || 'Database error' };
      }

      if (!data) {
        // no user found
        return { success: false, error: 'User not found' };
      }

      // NOTE: plaintext password comparison — replace with hashed comparison in prod
      if (data.password !== password) {
        return { success: false, error: 'Invalid password' };
      }

      // success: persist minimal user
      persistUser(data);
      return { success: true, user: data };
    } catch (err) {
      console.error('login unexpected', err);
      return { success: false, error: err.message || 'Unexpected error' };
    }
  };

  // REGISTER: responsible for creating user and associated role rows
  const registerUser = async ({
    username,
    password,
    name,
    email,
    role,
    patientDetails = null,
    doctorDetails = null
  }) => {
    try {
      // basic validation
      if (!username || !password || !name || !role) {
        return { success: false, error: 'Missing required fields' };
      }

      // check for duplicate username / email
      const { data: dup, error: dupErr } = await supabase
        .from('users')
        .select('id')
        .or(`username.eq.${username},email.eq.${email}`)
        .limit(1);

      if (dupErr) {
        console.error('dup check error', dupErr);
        return { success: false, error: dupErr.message || 'DB error' };
      }
      if (dup && dup.length > 0) {
        return { success: false, error: 'Username or email already exists' };
      }

      // insert user
      const { data: insertedUser, error: insertErr } = await supabase
        .from('users')
        .insert([{ username, password, role, name, email }])
        .select('*')
        .single();

      if (insertErr) {
        console.error('user insert err', insertErr);
        return { success: false, error: insertErr.message || 'Failed to create user' };
      }

      const userId = insertedUser.id;

      // insert role-specific record
      if (role === 'patient' && patientDetails) {
        const { error: pErr } = await supabase
          .from('patients')
          .insert([{
            user_id: userId,
            date_of_birth: patientDetails.date_of_birth || null,
            age: patientDetails.age || null,
            gender: patientDetails.gender || null,
            blood_group: patientDetails.blood_group || null,
            assigned_doctor_id: patientDetails.assigned_doctor_id || null
          }]);
        if (pErr) throw pErr;
      } else if (role === 'doctor' && doctorDetails) {
        const { error: dErr } = await supabase
          .from('doctors')
          .insert([{
            user_id: userId,
            specialization: doctorDetails.specialization || null,
            consultation_fee: doctorDetails.consultation_fee || null,
            license_number: doctorDetails.license_number || null
          }]);
        if (dErr) throw dErr;
      }

      return { success: true, user: insertedUser };
    } catch (err) {
      console.error('registerUser error', err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    persistUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    registerUser,
    setUser: persistUser
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
