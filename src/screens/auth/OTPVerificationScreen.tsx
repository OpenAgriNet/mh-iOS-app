import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { OTPInput } from '../../components/common/OTPInput';
import { Button } from '../../components/common/Button';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import { isValidOTP, formatMobileNumber } from '../../utils/crypto';
import { compareOTPLogin, compareOTPRegistration, sendOTPLogin, sendOTPRegistration } from '../../services/api/authService';
import { Colors } from '../../theme/colors';
import { SuccessModal } from '../../components/common/SuccessModal';
import { ErrorModal } from '../../components/common/ErrorModal';
import { Toast } from '../../components/common/Toast';

type OTPVerificationRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<OTPVerificationRouteProp>();
    const { t } = useTranslation();
    const { login } = useAuth();
    
    const { mobileNo, type, timestamp, name } = route.params;
    
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [successModal, setSuccessModal] = useState<{ visible: boolean; title: string; message?: string }>({
        visible: false,
        title: '',
        message: '',
    });
    const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: '',
    });

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleVerifyOTP = async () => {
        if (!isValidOTP(otp)) {
            setError(t('login.invalidOTP'));
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            let response;
            
            if (type === 'login') {
                response = await compareOTPLogin(mobileNo, otp);
            } else {
                response = await compareOTPRegistration(mobileNo, otp, timestamp || '');
            }
            
            if (response.success) {
                if (type === 'registration') {
                    // For registration, navigate to UserInformationScreen to complete profile
                    setSuccessModal({
                        visible: true,
                        title: t('login.otpVerified'),
                        message: t('login.completeYourProfile'),
                    });
                    // Navigate after a short delay to show the modal
                    setTimeout(() => {
                        navigation.navigate('UserInformation', {
                            mobileNo,
                            name: name || '',
                        });
                    }, 1500);
                } else {
                    // For login, save auth data and navigate to Dashboard
                    await login({
                        mobileNo,
                        token: response.token,
                        refreshToken: response.refresh_token,
                    });

                    setSuccessModal({
                        visible: true,
                        title: t('login.loginSuccess'),
                    });
                    // Navigate after a short delay to show the modal
                    setTimeout(() => {
                        navigation.navigate('Dashboard');
                    }, 1500);
                }
            } else {
                setError(response.message || t('login.loginFailed'));
            }
        } catch (error) {
            setError(t('login.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        setError('');
        
        try {
            let response;
            
            if (type === 'login') {
                response = await sendOTPLogin(mobileNo);
            } else {
                response = await sendOTPRegistration(mobileNo);
            }
            
            if (response.success) {
                setToastMessage(t('login.otpSentSuccessfully'));
                setToastVisible(true);
                setResendTimer(30);
                setCanResend(false);
                setOtp('');
            } else {
                setErrorModal({
                    visible: true,
                    message: response.message || t('login.failedToResendOTP'),
                });
            }
        } catch (error) {
            setErrorModal({
                visible: true,
                message: t('login.failedToResendOTP'),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('login.enterOTP')}
                subtitle={t('login.subtitle')}
                showBackButton={false}
                rightComponent={
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerInfo}>
                    <Text style={styles.headerInfoLabel}>
                        We've sent a verification code to
                    </Text>
                    <Text style={styles.headerInfoValue}>
                        {formatMobileNumber(mobileNo)}
                    </Text>
                </View>

                <OTPInput
                    length={6}
                    value={otp}
                    onChangeText={(text) => {
                        setOtp(text);
                        setError('');
                    }}
                    error={!!error}
                />

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                <View style={styles.timerResendContainer}>
                    <Text style={styles.timerText}>
                        {canResend ? '' : `0:${resendTimer.toString().padStart(2, '0')}`}
                    </Text>
                    <TouchableOpacity
                        onPress={handleResendOTP}
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

                <View style={styles.buttonContainer}>
                    <Button
                        title="Verify"
                        onPress={handleVerifyOTP}
                        loading={loading}
                        disabled={otp.length !== 6}
                    />
                </View>
            </ScrollView>

            {/* Success Modal */}
            <SuccessModal
                visible={successModal.visible}
                onClose={() => setSuccessModal({ visible: false, title: '', message: '' })}
                title={successModal.title}
                message={successModal.message}
            />

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
                type="success"
                onHide={() => setToastVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollView: {
        flex: 1,
        marginTop: 48,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    headerInfo: {
        marginBottom: 32,
    },
    headerInfoLabel: {
        color: Colors.text.secondary,
        fontSize: 15,
        marginBottom: 8,
    },
    headerInfoValue: {
        color: Colors.text.primary,
        fontSize: 15,
        fontWeight: '600',
    },
    errorText: {
        color: Colors.red[500],
        fontSize: 13,
        marginTop: 8,
        textAlign: 'center',
    },
    timerResendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    timerText: {
        color: Colors.text.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    resendButton: {
        padding: 4,
    },
    resendText: {
        color: Colors.brand.primary,
        fontWeight: '500',
        fontSize: 14,
    },
    resendTextDisabled: {
        color: Colors.gray[400],
    },
    buttonContainer: {
        marginTop: 24,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.gray[300],
    },
    closeButtonText: {
        fontSize: 18,
        color: Colors.text.primary,
        fontWeight: '600',
    },
});

