import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@auth_data';
const DUMMY_USER_MOBILE = '0000000000';
const DUMMY_USER_PASSWORD = 'admin123';

export interface User {
  mobileNo: string;
  name?: string;
  token?: string;
  refreshToken?: string;
  FAAPRegistrationID?: number;
  districtName?: string;
  districtNameMr?: string;
  districtCode?: number;
  talukaName?: string;
  talukaNameMr?: string;
  talukaCode?: number;
  villageName?: string;
  villageNameMr?: string;
  villageCode?: number;
  farmerId?: string | null;
  userType?: string;
  consent?: boolean;
  isOfficers?: boolean;
  pocraRoles?: any[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isDummyUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDummyUser, setIsDummyUser] = useState<boolean>(false);

  // Load saved auth data on mount
  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (authData) {
        const parsedData = JSON.parse(authData);
        setUser(parsedData.user);
        setIsDummyUser(parsedData.isDummyUser || false);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      // Check if it's dummy user
      const isDummy = userData.mobileNo === DUMMY_USER_MOBILE;
      
      const authData = {
        user: userData,
        isDummyUser: isDummy,
      };
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      setUser(userData);
      setIsDummyUser(isDummy);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setIsDummyUser(false);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...userData };
      const authData = {
        user: updatedUser,
        isDummyUser,
      };
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    isDummyUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export dummy credentials for reference
export const DUMMY_CREDENTIALS = {
  mobile: DUMMY_USER_MOBILE,
  password: DUMMY_USER_PASSWORD,
};

