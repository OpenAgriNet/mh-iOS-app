import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Input } from '../../components/common/Input';
import { MobileNumberInput } from '../../components/common/MobileNumberInput';
import { Button } from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { Colors } from '../../theme/colors';
import { isValidMobileNumber, isValidOTP } from '../../utils/crypto';
import { sendOTPRegistration, compareOTPRegistration } from '../../services/api/authService';
import { ErrorModal } from '../../components/common/ErrorModal';
import { Toast } from '../../components/common/Toast';
import { OTPBottomDrawer } from '../../components/common/OTPBottomDrawer';

export const RegisterScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
    const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: '',
    });
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
    const [otpDrawerVisible, setOtpDrawerVisible] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const validateInputs = (): boolean => {
        const newErrors: { name?: string; mobile?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Please enter your name';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!mobileNo.trim()) {
            newErrors.mobile = t('login.invalidMobile');
        } else if (!isValidMobileNumber(mobileNo)) {
            newErrors.mobile = t('login.invalidMobile');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const response = await sendOTPRegistration(mobileNo);
            if (response.success) {
                // Store timestamp for OTP verification
                setTimestamp(response.timestamp || '');

                // Show toast notification
                setToastMessage('OTP sent successfully');
                setToastType('success');
                setToastVisible(true);

                // Show OTP drawer
                setOtpDrawerVisible(true);
                setResendTimer(30);
                setCanResend(false);
            } else {
                // Check if it's "already registered" error - show as toast
                const errorMessage = response.message || 'Failed to send OTP';
                if (errorMessage.toLowerCase().includes('registered already') ||
                    errorMessage.toLowerCase().includes('already registered')) {
                    setToastMessage(errorMessage);
                    setToastType('error');
                    setToastVisible(true);
                } else {
                    // Show other errors in modal
                    setErrorModal({
                        visible: true,
                        message: errorMessage,
                    });
                }
            }
        } catch (error) {
            setErrorModal({
                visible: true,
                message: 'Failed to send OTP. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        if (!isValidOTP(otp)) {
            setErrorModal({
                visible: true,
                message: t('login.invalidOTP'),
            });
            return;
        }

        setOtpLoading(true);
        try {
            const response = await compareOTPRegistration(mobileNo, otp, timestamp);

            if (response.success) {
                // Close OTP drawer
                setOtpDrawerVisible(false);

                // Navigate to UserInformation screen
                navigation.navigate('UserInformation', {
                    mobileNo,
                    name: name.trim(),
                });
            } else {
                setErrorModal({
                    visible: true,
                    message: response.message || 'Invalid OTP',
                });
            }
        } catch (error) {
            setErrorModal({
                visible: true,
                message: 'Failed to verify OTP. Please try again.',
            });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        try {
            const response = await sendOTPRegistration(mobileNo);

            if (response.success) {
                // Update timestamp
                setTimestamp(response.timestamp || '');

                // Show toast notification
                setToastMessage('OTP sent successfully');
                setToastType('success');
                setToastVisible(true);

                // Reset timer
                setResendTimer(30);
                setCanResend(false);
            } else {
                setErrorModal({
                    visible: true,
                    message: response.message || 'Failed to resend OTP',
                });
            }
        } catch (error) {
            setErrorModal({
                visible: true,
                message: 'Failed to resend OTP. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('register.title')}
                subtitle={t('register.subtitle')}
                onBack={() => navigation.goBack()}
                rightComponent={<LanguageSelector variant="icon" />}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>
                    {t('register.personalInfo')}
                </Text>

                <Input
                    placeholder={t('register.namePlaceholder')}
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        setErrors({ ...errors, name: undefined });
                    }}
                    error={errors.name}
                />

                <MobileNumberInput
                    placeholder={t('register.mobilePlaceholder')}
                    value={mobileNo}
                    onChangeText={(text) => {
                        setMobileNo(text);
                        setErrors({ ...errors, mobile: undefined });
                    }}
                    error={errors.mobile}
                    maxLength={10}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title={t('common.verify')}
                        onPress={handleRegister}
                        loading={loading}
                    />
                </View>
            </ScrollView>

            {/* Error Modal */}
            <ErrorModal
                visible={errorModal.visible}
                onClose={() => setErrorModal({ visible: false, message: '' })}
                message={errorModal.message}
            />

            {/* Toast Notification */}
            <Toast
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onHide={() => setToastVisible(false)}
            />

            {/* OTP Bottom Drawer */}
            <OTPBottomDrawer
                visible={otpDrawerVisible}
                onClose={() => setOtpDrawerVisible(false)}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                mobileNo={mobileNo}
                loading={otpLoading}
                resendTimer={resendTimer}
                canResend={canResend}
                title="Enter OTP for Registration!"
                subtitle="We've sent a verification code to"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    languageSelector: {
        position: 'absolute',
        top: 48,
        right: 16,
        zIndex: 10,
    },
    scrollView: {
        flex: 1,
        marginTop: 48,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginTop: 16,
        marginBottom: 16,
    },
    buttonContainer: {
        marginTop: 16,
    },
});
