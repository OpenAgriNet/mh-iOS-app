import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageSelector } from '../common/LanguageSelector';
import { Colors } from '../../theme/colors';
import MenuIcon from '../../assets/icons/ic_menu.svg';

const logoImage = require('../../assets/images/mahavistaar-Ai.png');
const phoneIcon = require('../../assets/images/header-phone.png');
const bellIcon = require('../../assets/images/header-bell.png');

interface TopNavbarProps {
  onMenuPress: () => void;
  notificationCount?: number;
  onPhonePress?: () => void;
  onNotificationPress?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onMenuPress,
  notificationCount = 0,
  onPhonePress,
  onNotificationPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <MenuIcon color={Colors.white} width={24} height={24} />
          </TouchableOpacity>
          <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.appName}>MahaVISTAAR-AI</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton} onPress={onPhonePress}>
            <Image
              source={phoneIcon}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationContainer} onPress={onNotificationPress}>
            <Image
              source={bellIcon}
              style={styles.headerIcon}
              resizeMode="contain"
            />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <LanguageSelector variant="icon" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 4,
    marginRight: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  appName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconButton: {
    padding: 4,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  notificationContainer: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.red[500],
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
});

