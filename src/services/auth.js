import React from 'react';
import {post, patch} from './baseApi';

export const login = data => {
  return post('v1/login', data);
};

export const register = data => {
  return post('v1/register', data);
};

export const updateProfile = data => {
  return patch('v1/driver/profile', data);
};

export const validateRegister = data => {
  return post('v1/validate-register', data);
};

export const logout = data => {
  return get('v1/logout', data);
};

export const forgotPassword = data => {
  return post('v1/forgot-password', data);
};

export const verifyOtp = data => {
  return post('v1/otp/verify', data);
};

export const verifyForgotPassword = data => {
  return post('v1/forgot-password/verify', data);
};

export const resetPassword = data => {
  return post('v1/reset-password', data);
};

export const sendOtp = data => {
  return post('v1/otp/send', data);
};
