import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Colors } from '../../theme/colors';

interface MobileNumberInputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    containerStyle?: ViewStyle;
    maxLength?: number;
    editable?: boolean;
}

export const MobileNumberInput: React.FC<MobileNumberInputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    containerStyle,
    maxLength = 10,
    editable = true,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Filter input to only allow Western Arabic numerals (0-9)
    const handleTextChange = (text: string) => {
        // Remove any non-digit characters including Hindi numerals and letters
        // This regex only allows 0-9
        const numericText = text.replace(/[^0-9]/g, '');
        onChangeText(numericText);
    };

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
                    placeholder={placeholder}
                    value={value}
                    onChangeText={handleTextChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    keyboardType="number-pad"
                    maxLength={maxLength}
                    editable={editable}
                    // Prevent Hindi numerals and ensure Western Arabic numerals
                    textContentType="none"
                    autoComplete="off"
                    // Disable auto-capitalization for numeric input
                    autoCapitalize="none"
                    // Additional props to prevent localized numerals
                    {...(Platform.OS === 'android' ? {
                        // On Android, this helps prevent Hindi numerals
                        importantForAutofill: "no" as any,
                    } : {})}
                />
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
    errorText: {
        fontSize: 12,
        color: Colors.red[500],
        marginTop: 4,
        marginLeft: 4,
    },
});

