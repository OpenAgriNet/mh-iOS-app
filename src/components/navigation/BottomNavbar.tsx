import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Colors } from '../../theme/colors';
import Svg, { Path } from 'react-native-svg';

const chatbotIcon = require('../../assets/images/chatbot.png');
const homeIcon = require('../../assets/images/footer-home.png');
const chcIcon = require('../../assets/images/footer-chc.png');
const videosIcon = require('../../assets/images/footer-videos.png');
const shetishalaIcon = require('../../assets/images/footer-shetishala.png');

const FAB_SIZE = 72;
const CURVE_RADIUS = FAB_SIZE / 2 + 18;
const CURVE_DEPTH = 40;

type BottomNavbarNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomNavbarProps {
  activeTab: 'home' | 'chc' | 'videos' | 'shetishala';
  onTabChange: (tab: 'home' | 'chc' | 'videos' | 'shetishala') => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<BottomNavbarNavigationProp>();
  const [showChatbotTooltip, setShowChatbotTooltip] = React.useState(false);

  // Animation for chatbot icon
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    scaleAnimation.start();
    rotateAnimation.start();

    return () => {
      scaleAnimation.stop();
      rotateAnimation.stop();
    };
  }, [scaleAnim, rotateAnim]);

  const handleChatPress = () => {
    navigation.navigate('WebView', {
      url: 'https://oan-ui-service-goodworks.onrender.com'
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <View style={styles.bottomNavContainer}>
      {/* White Background */}
      <View style={styles.bottomNavBackground} />

      <Svg
        width="100%"
        height={50}
        viewBox="0 0 375 50"
        preserveAspectRatio="none"
        style={styles.curvedLineSvg}
      >
        <Path
          d={`
            M 0 3
            H ${187.5 - CURVE_RADIUS}

            C ${187.5 - CURVE_RADIUS * 0.65} 3,
            ${187.5 - CURVE_RADIUS * 0.65} ${CURVE_DEPTH},
            187.5 ${CURVE_DEPTH}

            C ${187.5 + CURVE_RADIUS * 0.65} ${CURVE_DEPTH},
            ${187.5 + CURVE_RADIUS * 0.65} 3,
            ${187.5 + CURVE_RADIUS} 3

            H 375
          `}
          stroke={Colors.brand.primary}
          strokeWidth={3}
          fill="none"
        />
      </Svg>

      {/* Elevated Chatbot Button */}
      <View style={styles.chatButtonContainer}>
        {showChatbotTooltip && (
          <Animated.View style={[styles.tooltip, { opacity: tooltipOpacity }]}>
            <Text style={styles.tooltipText}>{t('dashboard.bottomNav.chatbot')}</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatPress}
          onPressIn={() => {
            setShowChatbotTooltip(true);
            Animated.timing(tooltipOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.timing(tooltipOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => setShowChatbotTooltip(false));
          }}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.chatButtonOuter,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: spin }
                ]
              }
            ]}
          >
            <View style={styles.chatButtonInner}>
              <Image
                source={chatbotIcon}
                style={styles.chatButtonImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Items */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onTabChange('home')}
          activeOpacity={0.7}
        >
          <Image
            source={homeIcon}
            style={activeTab === 'home' ? styles.navIconImageActive : styles.navIconImageInactive}
            resizeMode="contain"
          />
          <Text style={activeTab === 'home' ? styles.navLabelActive : styles.navLabelInactive}>
            {t('dashboard.bottomNav.home')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onTabChange('chc')}
          activeOpacity={0.7}
        >
          <Image
            source={chcIcon}
            style={activeTab === 'chc' ? styles.navIconImageActive : styles.navIconImageInactive}
            resizeMode="contain"
          />
          <Text style={activeTab === 'chc' ? styles.navLabelActive : styles.navLabelInactive}>
            {t('dashboard.bottomNav.chc')}
          </Text>
        </TouchableOpacity>

        {/* Spacer for center button */}
        <View style={styles.navItem} pointerEvents="none" />

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onTabChange('videos')}
          activeOpacity={0.7}
        >
          <Image
            source={videosIcon}
            style={activeTab === 'videos' ? styles.navIconImageActive : styles.navIconImageInactive}
            resizeMode="contain"
          />
          <Text style={activeTab === 'videos' ? styles.navLabelActive : styles.navLabelInactive}>
            {t('dashboard.bottomNav.videos')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onTabChange('shetishala')}
          activeOpacity={0.7}
        >
          <Image
            source={shetishalaIcon}
            style={activeTab === 'shetishala' ? styles.navIconImageActive : styles.navIconImageInactive}
            resizeMode="contain"
          />
          <Text style={activeTab === 'shetishala' ? styles.navLabelActive : styles.navLabelInactive}>
            {t('dashboard.bottomNav.shetishala')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
  },
  bottomNavBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: Colors.white,
  },
  curvedLineSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 6,
    zIndex: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIconImageActive: {
    width: 28,
    height: 28,
    tintColor: Colors.brand.primary,
  },
  navIconImageInactive: {
    width: 28,
    height: 28,
    tintColor: Colors.gray[400],
  },
  navLabelActive: {
    fontSize: 12,
    color: Colors.brand.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  navLabelInactive: {
    fontSize: 12,
    color: Colors.gray[400],
    marginTop: 2,
  },
  chatButtonContainer: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -34,
    zIndex: 100,
  },
  tooltip: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    marginLeft: -60,
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  chatButton: {
    position: 'relative',
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  chatButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonImage: {
    width: 56,
    height: 56,
  },
});

