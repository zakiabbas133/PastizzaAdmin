import { formatDistanceToNow, format } from 'date-fns';

// Date formatting utilities
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return date;
  }
};

export const formatDateRelative = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return date;
  }
};

// Currency formatting
export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `$${amount}`;
  }
};

// Number formatting
export const formatNumber = (num) => {
  try {
    return new Intl.NumberFormat('en-US').format(num);
  } catch (error) {
    return num.toString();
  }
};

// Percentage formatting
export const formatPercentage = (num, decimals = 1) => {
  return `${(num).toFixed(decimals)}%`;
};

// Phone number formatting
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
};

// Capitalize string
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default {
  formatDate,
  formatDateRelative,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPhone,
  isValidEmail,
  truncateText,
  capitalize,
};
