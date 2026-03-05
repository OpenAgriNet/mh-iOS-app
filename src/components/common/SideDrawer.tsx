import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Animated,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import UserIcon from '../../assets/icons/ic_user.svg';
import LeaderboardIcon from '../../assets/icons/ic_leader_board.svg';
import CalculatorIcon from '../../assets/icons/ic_calculator.svg';
import CreditsIcon from '../../assets/icons/ic_credits.svg';
import AboutIcon from '../../assets/icons/ic_about.svg';
import LogOutIcon from '../../assets/icons/ic_logout.svg';
import ChevronRightIcon from '../../assets/icons/ic_arrow_right.svg';

interface SideDrawerProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
    onNavigate?: (screen: string) => void;
}

// Icon Components (ChevronRightIcon is imported)

export const SideDrawer: React.FC<SideDrawerProps> = ({ visible, onClose, onLogout, onNavigate }) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen to the left

    const menuItems = [
        { id: 'profile', label: t('sidebar.myProfile'), icon: UserIcon },
        { id: 'leaderboard', label: t('sidebar.leaderboard'), icon: LeaderboardIcon },
        { id: 'calculator', label: t('sidebar.costCalculator'), icon: CalculatorIcon },
        { id: 'credits', label: t('sidebar.credits'), icon: CreditsIcon },
        { id: 'about', label: t('sidebar.about'), icon: AboutIcon },
    ];

    // Animate drawer when visible changes
    useEffect(() => {
        if (visible) {
            // Slide in from left to right
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Reset position immediately without animation
            slideAnim.setValue(-300);
        }
    }, [visible, slideAnim]);

    const handleMenuItemPress = (itemId: string) => {
        // Close drawer immediately without animation
        onClose();
        // Navigate right after
        if (onNavigate) {
            onNavigate(itemId);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                            {/* Content Container with padding */}
                            <View style={styles.contentContainer}>
                                {/* User Profile Card */}
                                <View style={styles.profileCard}>
                                    <View style={styles.profileContent}>
                                        <View style={styles.avatar}>
                                            <UserIcon color={Colors.white} />
                                        </View>
                                        <View style={styles.userInfo}>
                                            <Text style={styles.userName}>{user?.name}</Text>
                                            <Text style={styles.userPhone}>{user?.mobileNo}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Menu Items Card */}
                                <View style={styles.menuCard}>
                                    {menuItems.map((item, index) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={[
                                                    styles.menuItem,
                                                    index < menuItems.length - 1 && styles.menuItemBorder
                                                ]}
                                                onPress={() => handleMenuItemPress(item.id)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.menuItemLeft}>
                                                    <View style={styles.menuIconContainer}>
                                                        <IconComponent color={Colors.brand.primary} />
                                                    </View>
                                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                                </View>
                                                <ChevronRightIcon color={Colors.gray[400]} />
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {/* Spacer to push logout and version to bottom */}
                                <View style={styles.spacer} />

                                {/* Logout Card */}
                                <View style={styles.logoutCard}>
                                    <TouchableOpacity
                                        style={styles.logoutItem}
                                        onPress={() => {
                                            onClose();
                                            onLogout();
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.menuItemLeft}>
                                            <View style={styles.menuIconContainer}>
                                                <LogOutIcon color={Colors.red[500]} />
                                            </View>
                                            <Text style={styles.logoutLabel}>{t('common.logout')}</Text>
                                        </View>
                                        <ChevronRightIcon color={Colors.gray[400]} />
                                    </TouchableOpacity>
                                </View>

                                {/* Version */}
                                <View style={styles.versionContainer}>
                                    <Text style={styles.versionText}>{t('sidebar.version')} 1.0.0</Text>
                                </View>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row',
    },
    drawer: {
        width: '85%',
        backgroundColor: Colors.white,
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    profileCard: {
        backgroundColor: Colors.brand.primary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        marginTop: 64,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 4,
    },
    userPhone: {
        fontSize: 16,
        color: Colors.white,
        opacity: 0.95,
    },
    menuCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.gray[200],
        overflow: 'hidden',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: 24,
        height: 24,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: {
        fontSize: 16,
        color: Colors.text.primary,
        fontWeight: '400',
    },
    spacer: {
        flex: 1,
    },
    logoutCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.gray[200],
        overflow: 'hidden',
        marginBottom: 16,
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    logoutLabel: {
        fontSize: 16,
        color: Colors.red[500],
        fontWeight: '400',
    },
    versionContainer: {
        paddingVertical: 16,
        paddingBottom: 24,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 14,
        color: Colors.gray[500],
    },
});

