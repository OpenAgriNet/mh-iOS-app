import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Colors } from '../../theme/colors';
import { getWeatherDetails, WeatherData } from '../../services/api/weatherService';

// Import feature icons
const cropAdvisoryIcon = require('../../assets/images/crop-advisory.png');
const sopIcon = require('../../assets/images/SOP.png');
const soilHealthCardIcon = require('../../assets/images/soil health card.png');
const fertilizerCalculatorIcon = require('../../assets/images/fertilizer calculator.png');
const climateResilientTechIcon = require('../../assets/images/climate resilent technology.png');
const pestDiseasesIcon = require('../../assets/images/pests and  diseases.png');
const marketPriceIcon = require('../../assets/images/market  price.png');
const dbtIcon = require('../../assets/images/Dbt.png');
const warehouseIcon = require('../../assets/images/warehouse.png');

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [showComingSoonPopup, setShowComingSoonPopup] = useState(false);
  const [clickedFeatureIndex, setClickedFeatureIndex] = useState<number | null>(null);
  const [showAddCropPopup, setShowAddCropPopup] = useState(false);
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const popupScale = useRef(new Animated.Value(0.8)).current;
  const addCropPopupOpacity = useRef(new Animated.Value(0)).current;
  const addCropPopupScale = useRef(new Animated.Value(0.8)).current;

  // Fetch weather data on component mount and when language changes
  useEffect(() => {
    fetchWeatherData();
  }, [user?.talukaCode, currentLanguage]);

  const fetchWeatherData = async () => {
    if (!user?.talukaCode) {
      setWeatherLoading(false);
      setWeatherError('Location not available');
      return;
    }

    try {
      setWeatherLoading(true);
      setWeatherError(null);
      const response = await getWeatherDetails(user.talukaCode, currentLanguage);
      if (response.success && response.data) {
        setWeatherData(response.data);
      } else {
        setWeatherError(response.message || 'Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeatherError('Failed to fetch weather data');
    } finally {
      setWeatherLoading(false);
    }
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 17) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getWeatherIcon = (cloudCover?: string) => {
    if (!cloudCover) return '⛅';
    const cover = cloudCover.toLowerCase();
    if (cover.includes('clear') || cover.includes('sunny')) return '☀️';
    if (cover.includes('rain')) return '🌧️';
    if (cover.includes('cloud') || cover.includes('ढगाळ')) return '☁️';
    return '⛅';
  };

  const handleFeaturePress = (index: number) => {
    setClickedFeatureIndex(index);
    setShowComingSoonPopup(true);

    // Animate popup appearance
    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(popupScale, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after 2 seconds
    setTimeout(() => {
      hidePopup();
    }, 2000);
  };

  const hidePopup = () => {
    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(popupScale, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowComingSoonPopup(false);
    });
  };

  const handleAddCropPress = () => {
    setShowAddCropPopup(true);

    // Animate popup appearance
    Animated.parallel([
      Animated.timing(addCropPopupOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(addCropPopupScale, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after 2 seconds
    setTimeout(() => {
      hideAddCropPopup();
    }, 2000);
  };

  const hideAddCropPopup = () => {
    Animated.parallel([
      Animated.timing(addCropPopupOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(addCropPopupScale, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowAddCropPopup(false);
    });
  };

  const features = [
    { title: t('dashboard.features.cropAdvisory'), icon: cropAdvisoryIcon },
    { title: t('dashboard.features.sop'), icon: sopIcon },
    { title: t('dashboard.features.soilHealthCard'), icon: soilHealthCardIcon },
    { title: t('dashboard.features.fertilizerCalculator'), icon: fertilizerCalculatorIcon },
    { title: t('dashboard.features.climateResilientTech'), icon: climateResilientTechIcon },
    { title: t('dashboard.features.pestDiseases'), icon: pestDiseasesIcon },
    { title: t('dashboard.features.marketPrice'), icon: marketPriceIcon },
    { title: t('dashboard.features.dbt'), icon: dbtIcon },
    { title: t('dashboard.features.warehouse'), icon: warehouseIcon },
  ];

  return (
    <>
      {/* Weather Card */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherGradient}>
          {/* Gradient Background */}
          <View style={StyleSheet.absoluteFill}>
            <Svg height="100%" width="100%">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#3b82f6" stopOpacity="1" />
                  <Stop offset="1" stopColor="#fed7aa" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
            </Svg>
          </View>

          {weatherLoading ? (
            <View style={styles.weatherLoadingContainer}>
              <ActivityIndicator size="large" color={Colors.white} />
              <Text style={styles.weatherLoadingText}>Loading weather...</Text>
            </View>
          ) : weatherError ? (
            <View style={styles.weatherContent}>
              <View style={styles.weatherLeft}>
                <Text style={styles.weatherDate}>{getCurrentDate()} | {getCurrentTime()}</Text>
                <Text style={styles.weatherTemp}>-- °C</Text>
                <Text style={styles.weatherLocation}>
                  {currentLanguage === 'mr' ? user?.talukaNameMr : user?.talukaName || 'Location unavailable'}
                </Text>
              </View>
              <View style={styles.weatherIcon}>
                <Text style={styles.weatherIconText}>🌤️</Text>
              </View>
            </View>
          ) : (
            <View style={styles.weatherContent}>
              <View style={styles.weatherLeft}>
                <Text style={styles.weatherDate}>
                  {getCurrentDate()} | {getCurrentTime()}
                </Text>
                <Text style={styles.weatherTemp}>
                  {weatherData?.Temperature?.min}°C / {weatherData?.Temperature?.max}°C
                </Text>
                <Text style={styles.weatherLocation}>
                  {currentLanguage === 'mr' ? user?.talukaNameMr : user?.talukaName || 'Location'}
                </Text>
              </View>
              <View style={styles.weatherIcon}>
                <Text style={styles.weatherIconText}>
                  {getWeatherIcon(weatherData?.Forcast?.[0]?.cloud_cover)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Greeting */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          {getGreeting()}, <Text style={styles.greetingName}>
            {user?.name || user?.mobileNo || ''}
          </Text>
        </Text>
      </View>

      {/* Crop Card */}
      <View style={styles.cropCard}>
        <View style={styles.cropInfo}>
          <Text style={styles.noCropsText}>{t('crop.noCropsAdded')}</Text>
        </View>
        <View style={styles.addCropButtonContainer}>
          <TouchableOpacity
            style={styles.addCropButton}
            onPress={handleAddCropPress}
            activeOpacity={0.7}
          >
            <Text style={styles.addCropIcon}>🌾</Text>
            <Text style={styles.addCropText}>{t('crop.addCrop')}</Text>
            <Text style={styles.addCropPlus}>+</Text>
          </TouchableOpacity>

          {/* Coming Soon Popup for Add Crop */}
          {showAddCropPopup && (
            <Animated.View
              style={[
                styles.addCropPopup,
                {
                  opacity: addCropPopupOpacity,
                  transform: [{ scale: addCropPopupScale }],
                },
              ]}
            >
              <Text style={styles.popupText}>{t('common.comingSoon')}</Text>
              <View style={styles.popupArrow} />
            </Animated.View>
          )}
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => handleFeaturePress(index)}
              activeOpacity={0.7}
            >
              <Image source={feature.icon} style={styles.featureIcon} resizeMode="contain" />
              <Text style={styles.featureTitle}>
                {feature.title}
              </Text>
            </TouchableOpacity>

            {/* Coming Soon Popup - positioned relative to each icon */}
            {showComingSoonPopup && clickedFeatureIndex === index && (
              <Animated.View
                style={[
                  styles.comingSoonPopup,
                  {
                    opacity: popupOpacity,
                    transform: [{ scale: popupScale }],
                  },
                ]}
              >
                <Text style={styles.popupText}>{t('common.comingSoon')}</Text>
                <View style={styles.popupArrow} />
              </Animated.View>
            )}
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  weatherCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  weatherGradient: {
    // backgroundColor: '#5B9FED', // Removed solid background to let gradient show
    borderRadius: 24,
    padding: 20,
    position: 'relative', // For absolute positioning of SVG
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flex: 1,
  },
  weatherDate: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  weatherTemp: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  weatherLocation: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  weatherIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIconText: {
    fontSize: 64,
  },
  weatherLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  weatherLoadingText: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 10,
    fontWeight: '500',
  },
  greetingContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
  },
  greetingText: {
    color: Colors.text.secondary,
    fontSize: 18,
    lineHeight: 24
  },
  greetingName: {
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  cropCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray[100],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noCropsText: {
    color: Colors.text.secondary,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  addCropButtonContainer: {
    position: 'relative',
  },
  addCropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addCropPopup: {
    position: 'absolute',
    top: -55, // Position above the button
    right: 0,
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  addCropIcon: {
    fontSize: 20,
  },
  addCropText: {
    color: Colors.brand.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  addCropPlus: {
    color: Colors.brand.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  featureItem: {
    width: '33.333%',
    padding: 8,
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  featureButton: {
    alignItems: 'center',
    width: '100%',
  },
  featureIconContainer: {
    width: 70,
    height: 70,
    backgroundColor: Colors.gray[100],
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 10,
  },
  featureIcon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.text.secondary,
    fontWeight: '500',
    paddingHorizontal: 2,
    lineHeight: 16,
  },
  comingSoonPopup: {
    position: 'absolute',
    top: -50, // Position above the icon
    left: '50%',
    marginLeft: -60, // Half of minWidth to center
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  popupArrow: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    marginLeft: -5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.brand.primary,
  },
  popupText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

