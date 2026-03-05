import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { OTPVerificationScreen } from './src/screens/auth/OTPVerificationScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { UserInformationScreen } from './src/screens/auth/UserInformationScreen';
import { DashboardScreen } from './src/screens/home/DashboardScreen';
import { WebViewScreen } from './src/screens/webview/WebViewScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { CHCScreen } from './src/screens/chc/CHCScreen';
import { VideosScreen } from './src/screens/videos/VideosScreen';
import { ShetishalaScreen } from './src/screens/shetishala/ShetishalaScreen';
import { MyProfileScreen } from './src/screens/profile/MyProfileScreen';
import { PartnersScreen } from './src/screens/partners/PartnersScreen';
import { AboutScreen } from './src/screens/about/AboutScreen';


import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/i18n/config'; // Initialize i18n
import { LanguageProvider } from './src/contexts/LanguageContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  OTPVerification: {
    mobileNo: string;
    type: 'login' | 'registration';
    timestamp?: string;
    name?: string;
  };
  Register: undefined;
  UserInformation: {
    mobileNo: string;
    name: string;
  };
  Dashboard: undefined;
  CHC: undefined;
  Videos: undefined;
  Shetishala: undefined;
  MyProfile: undefined;
  WebView: {
    url?: string;
  };
  Partners: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009640" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="UserInformation" component={UserInformationScreen} />
        </>
      ) : (
        // App Stack
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="CHC" component={CHCScreen} />
          <Stack.Screen name="Videos" component={VideosScreen} />
          <Stack.Screen name="Shetishala" component={ShetishalaScreen} />
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          <Stack.Screen name="UserInformation" component={UserInformationScreen} />
          <Stack.Screen name="WebView" component={WebViewScreen} />
          <Stack.Screen name="Partners" component={PartnersScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LanguageProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
