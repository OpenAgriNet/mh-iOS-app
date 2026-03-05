import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    rightIcon,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };
    // Force numeric keyboard to use Western Arabic numerals (0-9) instead of localized numerals
    // For text inputs, ensure autoCapitalize is respected (defaults to 'sentences' if not specified)
    const textInputProps = props.keyboardType === 'phone-pad' || props.keyboardType === 'number-pad'
        ? { ...props, textContentType: 'none' as const, autoComplete: 'off' as const }
        : { autoCapitalize: 'words' as const, ...props };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}
            <View style={[
                styles.inputWrapper,
                error && styles.inputWrapperError,
                isFocused && styles.inputWrapperFocused
            ]}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colors.gray[400]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...textInputProps}
                />
                {rightIcon && (
                    <View style={styles.rightIconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.secondary,
        marginBottom: 6,
        marginLeft: 4,
    },
    inputWrapper: {
        height: 48,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.transparent,
    },
    inputWrapperError: {
        borderColor: Colors.red[500],
    },
    inputWrapperFocused: {
        borderColor: Colors.brand.primary,
        borderWidth: 1.5,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.text.primary,
    },
    rightIconContainer: {
        marginLeft: 8,
    },
    errorText: {
        fontSize: 12,
        color: Colors.red[500],
        marginTop: 4,
        marginLeft: 4,
    },
});
