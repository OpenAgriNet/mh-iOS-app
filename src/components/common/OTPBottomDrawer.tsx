import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    TextInput,
    Keyboard,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';

interface OTPBottomDrawerProps {
    visible: boolean;
    onClose: () => void;
    onVerify: (otp: string) => void;
    onResend: () => void;
    mobileNo: string;
    loading?: boolean;
    resendTimer: number;
    canResend: boolean;
    title?: string;
    subtitle?: string;
}

const CloseIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" fill="#000000" />
        <Path
            d="M15 9L9 15M9 9L15 15"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </Svg>
);

export const OTPBottomDrawer: React.FC<OTPBottomDrawerProps> = ({
    visible,
    onClose,
    onVerify,
    onResend,
    mobileNo,
    loading = false,
    resendTimer,
    canResend,
    title = 'Enter OTP',
    subtitle = "We've sent a verification code to",
}) => {
    const slideAnim = useRef(new Animated.Value(600)).current;
    const [otp, setOtp] = React.useState('');
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) {
            // Slide up from bottom
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
            // Auto-focus input after a short delay
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        } else {
            // Slide down
            Animated.timing(slideAnim, {
                toValue: 600,
                duration: 250,
                useNativeDriver: true,
            }).start();
            // Clear OTP when closing
            setOtp('');
        }
    }, [visible, slideAnim]);

    const handleVerify = () => {
        if (otp.length === 6 && !loading) {
            Keyboard.dismiss();
            onVerify(otp);
        }
    };

    const handleResend = () => {
        if (canResend && !loading) {
            setOtp('');
            onResend();
        }
    };

    const formatMobileNumber = (mobile: string) => {
        if (!mobile || mobile.length < 3) {
            return `+91-${mobile}`;
        }
        return `+91-${'X'.repeat(Math.max(0, mobile.length - 3))}${mobile.slice(-3)}`;
    };

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.drawer,
                                { transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            {/* Close Button */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <CloseIcon />
                            </TouchableOpacity>

                            {/* Content */}
                            <View style={styles.content}>
                                <Text style={styles.title}>{title}</Text>

                                <Text style={styles.subtitle}>
                                    {subtitle}
                                </Text>
                                <Text style={styles.mobileNumber}>
                                    {formatMobileNumber(mobileNo)}
                                </Text>

                                {/* Single OTP Input */}
                                <TextInput
                                    ref={inputRef}
                                    style={[styles.otpInput, !otp && styles.otpInputPlaceholder]}
                                    value={otp}
                                    onChangeText={(text) => {
                                        const numericText = text.replace(/[^0-9]/g, '');
                                        setOtp(numericText.slice(0, 6));
                                    }}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    placeholderTextColor={Colors.gray[400]}
                                    textAlign="center"
                                    autoComplete="off"
                                    textContentType="oneTimeCode"
                                />

                                {/* Timer and Resend */}
                                <View style={styles.timerResendContainer}>
                                    <Text style={styles.timerText}>
                                        {canResend ? '' : formatTimer(resendTimer)}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={handleResend}
                                        disabled={!canResend || loading}
                                        style={styles.resendButton}
                                    >
                                        <Text style={[
                                            styles.resendText,
                                            (!canResend || loading) && styles.resendTextDisabled
                                        ]}>
                                            Resend OTP?
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Verify Button */}
                                <TouchableOpacity
                                    style={[
                                        styles.verifyButton,
                                        (otp.length !== 6 || loading) && styles.verifyButtonDisabled
                                    ]}
                                    onPress={handleVerify}
                                    disabled={otp.length !== 6 || loading}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.verifyButtonText}>
                                        {loading ? 'Verifying...' : 'Verify'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    drawer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
        minHeight: 480,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 4,
    },
    content: {
        paddingTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    mobileNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 32,
    },
    otpInput: {
        height: 56,
        borderWidth: 1,
        borderColor: Colors.gray[300],
        borderRadius: 12,
        backgroundColor: Colors.white,
        fontSize: 24,
        fontWeight: '600',
        color: Colors.text.primary,
        paddingHorizontal: 16,
        marginBottom: 16,
        letterSpacing: 8,
    },
    otpInputPlaceholder: {
        fontSize: 14,
        letterSpacing: 0,
    },
    timerResendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    timerText: {
        fontSize: 14,
        color: Colors.text.secondary,
        minWidth: 40,
    },
    resendButton: {
        padding: 4,
    },
    resendText: {
        fontSize: 14,
        color: Colors.brand.primary,
        fontWeight: '500',
    },
    resendTextDisabled: {
        color: Colors.gray[400],
    },
    verifyButton: {
        height: 56,
        backgroundColor: Colors.brand.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyButtonDisabled: {
        backgroundColor: Colors.gray[300],
    },
    verifyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
});


