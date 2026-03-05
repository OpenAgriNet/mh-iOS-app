import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { SideDrawer } from '../../components/common/SideDrawer';
import { TopNavbar } from '../../components/navigation/TopNavbar';
import { BottomNavbar } from '../../components/navigation/BottomNavbar';
import { HomeScreen } from './HomeScreen';
import { Colors } from '../../theme/colors';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export const DashboardScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<DashboardScreenNavigationProp>();
    const { logout } = useAuth();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = async () => {
        await logout();
    };

    const handleTabChange = (tab: 'home' | 'chc' | 'videos' | 'shetishala') => {
        if (tab === 'chc') {
            navigation.navigate('CHC');
        } else if (tab === 'videos') {
            navigation.navigate('Videos');
        } else if (tab === 'shetishala') {
            navigation.navigate('Shetishala');
        }
        // If tab is 'home', we're already on Dashboard, so do nothing
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
                <HomeScreen />
            </ScrollView>

            <BottomNavbar activeTab="home" onTabChange={handleTabChange} />

            {/* Side Drawer */}
            <SideDrawer
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
            />

            {/* Logout Confirmation Modal */}
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
