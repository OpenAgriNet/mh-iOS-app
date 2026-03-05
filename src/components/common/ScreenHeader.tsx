import React from 'react';
import { Dimensions } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChevronLeft from '../../assets/icons/ic_chevron_left.svg';
import { Colors } from '../../theme/colors';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    showLogo?: boolean;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.33;

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    title,
    subtitle,
    onBack,
    showLogo = true,
    showBackButton = false,
    onBackPress,
    rightComponent,
}) => {
    const insets = useSafeAreaInsets();
    const handleBack = onBackPress || onBack;

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpg')}
            style={[styles.container, { paddingTop: insets.top }]}
            resizeMode="cover"
        >
            {/* App Bar Row */}
            <View style={styles.appBar}>
                {(showBackButton || handleBack) ? (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <ChevronLeft width={24} height={24} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.spacer} />
                )}

                {rightComponent ? (
                    <View style={styles.rightComponent}>{rightComponent}</View>
                ) : (
                    <View style={styles.spacer} />
                )}
            </View>

            {/* Main Content Area */}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && (
                    <Text style={styles.subtitle}>
                        {subtitle}
                    </Text>
                )}
            </View>


            <View style={styles.curveWrapper}>
                <View style={styles.curve} />
            </View>

            {showLogo && (
                <View style={styles.logoContainer}>
                    <View style={styles.logoOuter}>
                        <Image
                            source={require('../../assets/images/mahavistaar-Ai.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.brand.primary,
        height: HEADER_HEIGHT,
        width: '100%',
        position: 'relative',
    },
    appBar: {
        paddingHorizontal: 20,
        paddingTop: 0, // Insets handled by container
        height: 56, // Standard app bar height
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        width: 40,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60, // Push content up to visually center above the curve
    },
    title: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: 'medium',
        textAlign: 'center',
        marginTop: 16,
    },
    subtitle: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: 'medium',
        textAlign: 'center',
        marginTop: 4,
    },
    rightComponent: {
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 40,
    },
    curveWrapper: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 80,
        overflow: 'hidden',
    },

    curve: {
        position: 'absolute',
        bottom: -40,
        width: '110%',          // 👈 overshoot
        left: '-5%',
        height: 60,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 96,
        borderTopRightRadius: 96,
    },

    logoContainer: {
        position: 'absolute',
        bottom: -40,
        alignSelf: 'center',
        zIndex: 10,
    },
    logoOuter: {
        width: 96,
        height: 96,
        backgroundColor: Colors.white,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 4,
        borderColor: Colors.white,
        overflow: 'hidden',
    },
    logoImage: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
});
