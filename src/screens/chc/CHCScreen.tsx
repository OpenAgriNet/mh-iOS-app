import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TopNavbar } from '../../components/navigation/TopNavbar';
import { BottomNavbar } from '../../components/navigation/BottomNavbar';
import { LaunchingSoon } from '../../components/common/LaunchingSoon';
import { SideDrawer } from '../../components/common/SideDrawer';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type CHCScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CHC'>;

export const CHCScreen = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigation = useNavigation<CHCScreenNavigationProp>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    await logout();
  };

  const handleTabChange = (tab: 'home' | 'chc' | 'videos' | 'shetishala') => {
    if (tab === 'home') {
      navigation.navigate('Dashboard');
    } else if (tab === 'videos') {
      navigation.navigate('Videos');
    } else if (tab === 'shetishala') {
      navigation.navigate('Shetishala');
    }
  };

  const handleNavigate = (screen: string) => {
    if (screen === 'profile') {
      navigation.navigate('MyProfile');
    } else if (screen === 'credits') {
      navigation.navigate('Partners');
    } else if (screen === 'about') {
      navigation.navigate('About');
    }
  };

  return (
    <View style={styles.container}>
      <TopNavbar
        onMenuPress={() => setDrawerVisible(true)}
        notificationCount={6}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <LaunchingSoon />
      </ScrollView>

      <BottomNavbar activeTab="chc" onTabChange={handleTabChange} />

      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      <ConfirmModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
        title={t('common.logout')}
        message="Are you sure you want to logout?"
        confirmText={t('common.logout')}
        cancelText={t('common.cancel')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

