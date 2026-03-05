import { apiClient, API_CONFIG } from './config';
import { hashPassword } from '../../utils/crypto';

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

export interface CompareOTPResponse {
  success: boolean;
  message?: string;
  token?: string;
  refresh_token?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  refresh_token?: string;
  user?: any;
  FAAPRegistrationID?: number;
}

export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  refresh_token?: string;
}

export interface RegistrationData {
  Name: string;
  EmailId?: string;
  DistrictName: string;
  DistrictCode: number;
  TalukaName: string;
  TalukaCode: number;
  VillageName: string;
  VillageCode: string;
  Status?: string;
  version_number?: string;
  fcm_token?: string;
  device_id?: string;
  FAAPRegistrationID?: string;
}

export interface UpdateProfileData {
  Name: string;
  EmailId?: string;
  DistrictName: string;
  DistrictCode: number;
  TalukaName: string;
  TalukaCode: number;
  VillageName: string;
  VillageCode: string;
  Status?: string;
  version_number?: string;
  FAAPRegistrationID?: string;
  Password?: string;
}

export interface FarmerIDOTPResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
  mobileNo?: string;
}

export interface FarmerIDLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  refresh_token?: string;
  user?: any;
  FAAPRegistrationID?: number;
}

export interface RegistrationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface UserDetailsData {
  FAAPRegistrationID: number;
  Name: string;
  MobileNo: string;
  DistrictName: string;
  DistrictNameMr: string;
  DistrictCode: number;
  TalukaName: string;
  TalukaNameMr: string;
  TalukaCode: number;
  VillageName: string;
  VillageNameMr: string;
  VillageCode: number;
  farmer_id: string | null;
  user_type: string;
  consent: boolean;
  is_officers: boolean;
  pocra_roles: any[];
}

export interface UserDetailsResponse {
  success: boolean;
  message?: string;
  data?: UserDetailsData;
}

/**
 * Send OTP for login
 */
export const sendOTPLogin = async (mobileNo: string): Promise<SendOTPResponse> => {
  try {
    const response = await apiClient.post('/authService/SendOTP', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
    }, {
      headers: {
        'MobileNo': mobileNo,
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP',
    };
  }
};

/**
 * Compare OTP for login
 */
export const compareOTPLogin = async (
  mobileNo: string,
  otp: string
): Promise<CompareOTPResponse> => {
  try {
    const response = await apiClient.post('/authService/compareOTP', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
      otp: otp,
    }, {
      headers: {
        'MobileNo': mobileNo,
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid OTP',
    };
  }
};

/**
 * Send OTP for registration
 */
export const sendOTPRegistration = async (mobileNo: string): Promise<SendOTPResponse> => {
  try {
    const response = await apiClient.post('/authService/SendOTPRegistration', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
    }, {
      headers: {
        'MobileNo': mobileNo,
      },
    });

    // Check if response contains error field (e.g., "You are registered already")
    if (response.data?.error) {
      return {
        success: false,
        message: response.data.error,
      };
    }

    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP',
    };
  }
};

/**
 * Compare OTP for registration
 */
export const compareOTPRegistration = async (
  mobileNo: string,
  otp: string,
  timestamp: string
): Promise<CompareOTPResponse> => {
  try {
    const response = await apiClient.post('/authService/compareOTPReg', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
      otp: otp,
    }, {
      headers: {
        'MobileNo': mobileNo,
        'timestamp': timestamp,
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid OTP',
    };
  }
};

/**
 * Login with mobile and refresh token (after OTP verification)
 */
export const loginWithRefreshToken = async (
  mobileNo: string,
  refreshToken: string,
  otp: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/authService/LoginCheck', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
      MobileNo: mobileNo,
      otp: otp,
      refresh_token: refreshToken,
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};

/**
 * Login with mobile and password
 */
export const loginWithPassword = async (
  mobileNo: string,
  password: string
): Promise<LoginResponse> => {
  try {
    // Hash password using SHA-512 before sending to API
    const hashedPassword = hashPassword(password);
    const response = await apiClient.post('/authService/LoginCheck', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
      MobileNo: mobileNo,
      Password: hashedPassword,
    });

    // Check if response indicates wrong credentials (status 201 with error message)
    if (response.data?.status === 201 &&
        response.data?.response === "Either Your User Name or Password is Wrong.") {
      return {
        success: false,
        message: response.data.response,
      };
    }

    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};

/**
 * Refresh authentication token
 */
export const refreshAuthToken = async (
  mobileNo: string,
  otp: string
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post('/authService/refreshtoken', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
    }, {
      headers: {
        'MobileNo': mobileNo,
        'otp': otp,
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
    };
  }
};

/**
 * Complete user registration
 */
export const completeRegistration = async (
  mobileNo: string,
  registrationData: RegistrationData
): Promise<RegistrationResponse> => {
  try {
    const response = await apiClient.post('/authService/AddEditRegistration', {
      ...registrationData,
      SecurityKey: API_CONFIG.SECURITY_KEY,
    }, {
      headers: {
        'MobileNo': mobileNo,
        'NewMobileNo': mobileNo,
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
    };
  }
};

/**
 * Get user details/profile
 */
export const getUserDetails = async (
  faapRegistrationID: number
): Promise<UserDetailsResponse> => {
  try {
    const response = await apiClient.post('/authService/getUserdetails', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
    }, {
      headers: {
        'FAAPRegistrationID': faapRegistrationID.toString(),
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user details',
    };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  mobileNo: string,
  newMobileNo: string,
  profileData: UpdateProfileData
): Promise<RegistrationResponse> => {
  try {
    const requestBody: any = {
      Name: profileData.Name,
      EmailId: profileData.EmailId || '',
      DistrictName: profileData.DistrictName,
      DistrictCode: profileData.DistrictCode,
      TalukaName: profileData.TalukaName,
      TalukaCode: profileData.TalukaCode,
      VillageName: profileData.VillageName,
      VillageCode: profileData.VillageCode,
      Status: profileData.Status || 'Active',
      version_number: profileData.version_number || '1.2',
      FAAPRegistrationID: profileData.FAAPRegistrationID || '',
      SecurityKey: API_CONFIG.SECURITY_KEY,
    };

    // Only add password if it's provided
    if (profileData.Password) {
      requestBody.Password = hashPassword(profileData.Password);
    }

    const response = await apiClient.post('/authService/AddEditRegistration', requestBody, {
      headers: {
        'MobileNo': mobileNo,
        'NewMobileNo': newMobileNo,
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile',
    };
  }
};

/**
 * ========================================
 * FARMER ID LOGIN FLOW (Separate from existing login)
 * ========================================
 */

/**
 * Step 1: Send OTP using Farmer ID
 * Endpoint: POST /authService/farmeridotpn
 */
export const sendFarmerIDOTP = async (farmerId: string): Promise<FarmerIDOTPResponse> => {
  try {
    const response = await apiClient.post('/authService/farmeridotpn', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
    }, {
      headers: {
        'FarmerID': farmerId,
      },
    });
    return {
      success: true,
      ...response.data,
      mobileNo: response.data.mobile ,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP to Farmer ID',
    };
  }
};

/**
 * Step 2: Compare/Verify OTP for Farmer ID
 * Endpoint: POST /authService/compareOTP
 * Note: This uses the same compareOTP endpoint but with mobile number from step 1
 */
export const compareFarmerIDOTP = async (
  mobileNo: string,
  otp: string
): Promise<CompareOTPResponse> => {
  try {
    const response = await apiClient.post('/authService/compareOTP', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
      otp: otp,
    }, {
      headers: {
        'MobileNo': mobileNo,
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid OTP',
    };
  }
};

/**
 * Step 3: Complete Farmer ID login with OTP verification
 * Endpoint: POST /authService/farmerid_reg_compare_otp
 */
export const verifyFarmerIDLogin = async (
  farmerId: string,
  otp: string,
  timestamp: string,
  versionNumber: string = '2.0.1',
  deviceId: string = 'unknown'
): Promise<FarmerIDLoginResponse> => {
  try {
    const response = await apiClient.post('/authService/farmerid_reg_compare_otp', {
      SecurityKey: API_CONFIG.SECURITY_KEY,
    }, {
      headers: {
        'FarmerID': farmerId,
        'otp': otp,
        'timestamp': timestamp,
        'versionNumber': versionNumber,
        'deviceId': deviceId,
      },
    });
    return { success: true, ...response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Farmer ID login failed',
    };
  }
};

