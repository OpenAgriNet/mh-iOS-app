import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';

const rocketImage = require('../assets/images/rocket.png');

export const LaunchingSoonScreen = () => {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerLeft}>
                        <View style={styles.logo} />
                        <Text style={styles.appName}>{t('dashboard.appName')}</Text>
                    </View>
                    <View style={styles.headerRight} />
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Rocket Illustration */}
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

                {/* Title */}
                <Text style={styles.title}>{t('launchingSoon.title')}</Text>

                {/* Message */}
                <Text style={styles.message}>{t('launchingSoon.message')}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
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
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    backButtonText: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '400',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginLeft: -36, // Offset to center the title
    },
    headerRight: {
        width: 36, // Same width as back button for balance
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        marginRight: 10,
    },
    appName: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
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
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.brand.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: Colors.text.muted,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
});

