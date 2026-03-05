import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface ButtonProps {
    onPress: () => void;
    title: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    loading = false,
    disabled = false,
    variant = 'primary',
    style,
}) => {
    const getButtonStyle = (): ViewStyle[] => {
        const baseStyles = [styles.button];

        switch (variant) {
            case 'secondary':
                baseStyles.push(styles.buttonSecondary);
                break;
            case 'outline':
                baseStyles.push(styles.buttonOutline);
                break;
            default:
                baseStyles.push(styles.buttonPrimary);
        }

        if (disabled || loading) {
            baseStyles.push(styles.buttonDisabled);
        }

        if (style) {
            baseStyles.push(style);
        }

        return baseStyles;
    };

    const getTextStyle = () => {
        return variant === 'outline' ? styles.textOutline : styles.textDefault;
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || loading}
            style={getButtonStyle()}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? Colors.brand.primary : Colors.white} />
            ) : (
                <Text style={[styles.text, getTextStyle()]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPrimary: {
        backgroundColor: Colors.brand.primary,
    },
    buttonSecondary: {
        backgroundColor: Colors.brand.secondary,
    },
    buttonOutline: {
        backgroundColor: Colors.transparent,
        borderWidth: 1,
        borderColor: Colors.brand.primary,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    textDefault: {
        color: Colors.white,
    },
    textOutline: {
        color: Colors.brand.primary,
    },
});
