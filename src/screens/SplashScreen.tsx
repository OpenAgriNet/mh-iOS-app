import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('screen');

interface SplashScreenProps {
    onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    useEffect(() => {
        // Display splash screen for 2 seconds
        const timer = setTimeout(() => {
            onFinish();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <Image
                source={require('../assets/images/splash.png')}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009640',
    },
    image: {
        width: width,
        height: height,
    },
});

