import { Alert } from 'react-native';

export const handleApiError = (error, defaultMessage = 'Something went wrong') => {
  console.error('API Error:', error);
  
  let errorMessage = defaultMessage;
  
  if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error?.message) {
    errorMessage = error.message;
  }
  
  return errorMessage;
};

export const showErrorAlert = (error, title = 'Error', defaultMessage = 'Something went wrong') => {
  const message = handleApiError(error, defaultMessage);
  Alert.alert(title, message);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  // Check if it's a valid length (10 digits for Nepal)
  return cleanNumber.length === 10;
};

export const formatPhoneNumber = (phoneNumber) => {
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  // Format as needed (e.g., add country code)
  return cleanNumber;
};