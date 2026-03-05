import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../theme/colors';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    type = 'success',
    duration = 3000,
    onHide,
}) => {
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            // Show animation
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onHide) {
                onHide();
            }
        });
    };

    if (!visible && opacity._value === 0) {
        return null;
    }

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return Colors.brand.primary;
            case 'error':
                return Colors.red[500];
            case 'info':
                return Colors.blue[500];
            default:
                return Colors.brand.primary;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'info':
                return 'ℹ';
            default:
                return '✓';
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                    backgroundColor: getBackgroundColor(),
                },
            ]}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{getIcon()}</Text>
            </View>
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 9999,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.brand.primary,
    },
    message: {
        flex: 1,
        fontSize: 14,
        color: Colors.white,
        fontWeight: '500',
    },
});

