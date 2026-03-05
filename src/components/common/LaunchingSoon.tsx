import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';

const rocketImage = require('../../assets/images/rocket.png');

export const LaunchingSoon: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.launchingSoonContainer}>
      <View style={styles.rocketContainer}>
        <Image
          source={rocketImage}
          style={styles.rocketImage}
          resizeMode="contain"
        />
        <View style={styles.cloudContainer}>
          <Text style={styles.cloud}>☁️</Text>
          <Text style={[styles.cloud, styles.cloud2]}>☁️</Text>
          <Text style={[styles.cloud, styles.cloud3]}>☁️</Text>
        </View>
      </View>
      <Text style={styles.launchingSoonTitle}>{t('launchingSoon.title')}</Text>
      <Text style={styles.launchingSoonMessage}>{t('launchingSoon.message')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  launchingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
    minHeight: 500,
  },
  rocketContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  rocketImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  cloudContainer: {
    position: 'absolute',
    width: 300,
    height: 200,
    bottom: -20,
  },
  cloud: {
    fontSize: 40,
    position: 'absolute',
    opacity: 0.6,
  },
  cloud2: {
    left: 80,
    top: 20,
    fontSize: 50,
  },
  cloud3: {
    right: 40,
    top: 10,
    fontSize: 35,
  },
  launchingSoonTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.brand.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  launchingSoonMessage: {
    fontSize: 16,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
});

