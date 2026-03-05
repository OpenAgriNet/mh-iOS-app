import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface OTPInputProps {
    length?: number;
    value: string;
    onChangeText: (text: string) => void;
    containerStyle?: ViewStyle;
    error?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    length = 6,
    value,
    onChangeText,
    containerStyle,
    error = false,
}) => {
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleChangeText = (text: string, index: number) => {
        // Only allow numeric input
        const numericText = text.replace(/[^0-9]/g, '');
        
        if (numericText.length === 0) {
            // Handle backspace
            const newValue = value.slice(0, index) + value.slice(index + 1);
            onChangeText(newValue);
            
            // Move to previous input
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (numericText.length === 1) {
            // Single digit input
            const newValue = value.slice(0, index) + numericText + value.slice(index + 1);
            onChangeText(newValue.slice(0, length));
            
            // Move to next input
            if (index < length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        } else if (numericText.length > 1) {
            // Paste operation - fill all boxes
            const newValue = numericText.slice(0, length);
            onChangeText(newValue);
            
            // Focus the last filled box or the next empty one
            const nextIndex = Math.min(newValue.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {Array.from({ length }).map((_, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                        styles.input,
                        focusedIndex === index && styles.inputFocused,
                        error && styles.inputError,
                        value[index] && styles.inputFilled,
                    ]}
                    value={value[index] || ''}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textContentType="oneTimeCode"
                    autoComplete="off"
                    selectTextOnFocus
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    input: {
        flex: 1,
        height: 56,
        borderWidth: 1,
        borderColor: Colors.gray[300],
        borderRadius: 12,
        backgroundColor: Colors.white,
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.text.primary,
    },
    inputFocused: {
        borderColor: Colors.brand.primary,
        borderWidth: 2,
    },
    inputFilled: {
        borderColor: Colors.brand.primary,
        backgroundColor: Colors.white,
    },
    inputError: {
        borderColor: Colors.red[500],
    },
});

