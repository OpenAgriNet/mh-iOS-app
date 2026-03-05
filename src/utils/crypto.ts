import CryptoJS from 'crypto-js';

/**
 * Hash password using SHA-512
 * @param password - Plain text password
 * @returns Hashed password in hex format
 */
export const hashPassword = (password: string): string => {
  return CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
};

/**
 * Validate mobile number format (Indian)
 * @param mobile - Mobile number string
 * @returns boolean indicating if mobile is valid
 */
export const isValidMobileNumber = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

/**
 * Validate OTP format (6 digits)
 * @param otp - OTP string
 * @returns boolean indicating if OTP is valid
 */
export const isValidOTP = (otp: string): boolean => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Format mobile number for display
 * @param mobile - Mobile number string
 * @returns Formatted mobile number
 */
export const formatMobileNumber = (mobile: string): string => {
  if (mobile.length === 10) {
    return `${mobile.slice(0, 5)} ${mobile.slice(5)}`;
  }
  return mobile;
};

