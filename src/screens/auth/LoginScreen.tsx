import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Input } from '../../components/common/Input';
import { MobileNumberInput } from '../../components/common/MobileNumberInput';
import { Button } from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { useAuth, DUMMY_CREDENTIALS } from '../../contexts/AuthContext';
import { isValidMobileNumber } from '../../utils/crypto';
import { sendOTPLogin, loginWithPassword, compareOTPLogin, refreshAuthToken, loginWithRefreshToken, getUserDetails, sendFarmerIDOTP, verifyFarmerIDLogin } from '../../services/api/authService';
import { Colors } from '../../theme/colors';
import { ComingSoonModal } from '../../components/common/ComingSoonModal';
import { SuccessModal } from '../../components/common/SuccessModal';
import { ErrorModal } from '../../components/common/ErrorModal';
import { Toast } from '../../components/common/Toast';
import { OTPBottomDrawer } from '../../components/common/OTPBottomDrawer';

export const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const { login } = useAuth();

    const [loginType, setLoginType] = useState<'mobile' | 'farmerId'>('mobile');
    const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp');
    const [mobileNo, setMobileNo] = useState('');
    const [farmerId, setFarmerId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ mobile?: string; password?: string; farmerId?: string }>({});
    const [comingSoonVisible, setComingSoonVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
    const [successModal, setSuccessModal] = useState<{ visible: boolean; title: string; message?: string }>({
        visible: false,
        title: '',
        message: '',
    });
    const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: '',
    });
    const [otpDrawerVisible, setOtpDrawerVisible] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Farmer ID login specific state
    const [farmerMobileNo, setFarmerMobileNo] = useState('');
    const [farmerOTPTimestamp, setFarmerOTPTimestamp] = useState('');

    // Timer for OTP resend
    React.useEffect(() => {
        if (otpDrawerVisible && resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
    }, [resendTimer, otpDrawerVisible]);

    const validateInputs = (): boolean => {
        const newErrors: { mobile?: string; password?: string; farmerId?: string } = {};

        if (loginType === 'mobile') {
            if (!mobileNo.trim()) {
                newErrors.mobile = t('login.invalidMobile');
            } else if (mobileNo !== DUMMY_CREDENTIALS.mobile && !isValidMobileNumber(mobileNo)) {
                // Allow demo user mobile number to bypass validation
                newErrors.mobile = t('login.invalidMobile');
            }
        } else {
            if (!farmerId.trim()) {
                newErrors.farmerId = 'Please enter Farmer ID';
            }
        }

        if (loginMode === 'password' && password.length < 6) {
            newErrors.password = t('login.invalidPassword');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDummyLogin = async () => {
        setLoading(true);
        try {
            await login({
                mobileNo: DUMMY_CREDENTIALS.mobile,
                name: 'Demo User',
            });
            setSuccessModal({
                visible: true,
                title: t('login.loginSuccess'),
                message: 'Welcome to Demo Mode!',
            });
        } catch (error) {
            setErrorModal({
                visible: true,
                message: 'Failed to login',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!validateInputs()) return;

        // Check for dummy user
        if (mobileNo === DUMMY_CREDENTIALS.mobile) {
            await handleDummyLogin();
            return;
        }

        setLoading(true);
        try {
            const response = await sendOTPLogin(mobileNo);
            if (response.success) {
                // Show toast notification
                setToastMessage('OTP sent successfully');
                setToastType('success');
                setToastVisible(true);

                // Show OTP drawer
                setOtpDrawerVisible(true);
                setResendTimer(30);
                setCanResend(false);
            } else {
                setErrorModal({
                    visible: true,
                    message: response.message || t('login.loginFailed'),
                });
            }
        } catch (error) {
            setErrorModal({
                visible: true,
                message: t('login.loginFailed'),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        setOtpLoading(true);
        try {
            // Step 1: Compare OTP
            const compareResponse = await compareOTPLogin(mobileNo, otp);
            if (!compareResponse.success) {
                setErrorModal({
                    visible: true,
                    message: compareResponse.message || 'Invalid OTP',
                });
                setOtpLoading(false);
                return;
            }

            // Step 2: Get refresh token
            const refreshResponse = await refreshAuthToken(mobileNo, otp);
            if (!refreshResponse.success || !refreshResponse.refresh_token) {
                setErrorModal({
                    visible: true,
                    message: 'Failed to get refresh token',
                });
                setOtpLoading(false);
                return;
            }

            // Step 3: Login with refresh token and OTP
            const loginResponse = await loginWithRefreshToken(mobileNo, refreshResponse.refresh_token, otp);
            if (loginResponse.success && loginResponse.FAAPRegistrationID) {
                // Step 4: Fetch user profile details
                const profileResponse = await getUserDetails(loginResponse.FAAPRegistrationID);

                // Save auth data with FAAPRegistrationID and profile data
                await login({
                    mobileNo,
                    token: loginResponse.token,
                    refreshToken: refreshResponse.refresh_token,
                    FAAPRegistrationID: loginResponse.FAAPRegistrationID,
                    // Add profile data if available
                    ...(profileResponse.success && profileResponse.data ? {
                        name: profileResponse.data.Name,
                        districtName: profileResponse.data.DistrictName,
                        districtNameMr: profileResponse.data.DistrictNameMr,
                        districtCode: profileResponse.data.DistrictCode,
                        talukaName: profileResponse.data.TalukaName,
                        talukaNameMr: profileResponse.data.TalukaNameMr,
                        talukaCode: profileResponse.data.TalukaCode,
                        villageName: profileResponse.data.VillageName,
                        villageNameMr: profileResponse.data.VillageNameMr,
                        villageCode: profileResponse.data.VillageCode,
                        farmerId: profileResponse.data.farmer_id,
                        userType: profileResponse.data.user_type,
                        consent: profileResponse.data.consent,
                        isOfficers: profileResponse.data.is_officers,
                        pocraRoles: profileResponse.data.pocra_roles,
                    } : {}),
                });

                // Close drawer
                setOtpDrawerVisible(false);

                // Show success modal
                setSuccessModal({
                    visible: true,
                    title: t('login.loginSuccess'),
                });
            } else {
                setErrorModal({
                    visible: true,
                    message: loginResponse.message || 'Login failed',
                });
            }
        } catch (error) {
            setErrorModal({
                visible: true,
                message: 'Login failed. Please try again.',
            });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const response = await sendOTPLogin(mobileNo);
            if (response.success) {
                setToastMessage('OTP sent successfully');
                setToastType('success');
                setToastVisible(true);
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
                message: 'Failed to resend OTP',
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async () => {
        if (!validateInputs()) return;

        // Check for dummy user
        if (mobileNo === DUMMY_CREDENTIALS.mobile && password === DUMMY_CREDENTIALS.password) {
            await handleDummyLogin();
            return;
        }

        setLoading(true);
        try {
            const response = await loginWithPassword(mobileNo, password);
            if (response.success) {
                await login({
                    mobileNo,
                    token: response.token,
                    refreshToken: response.refresh_token,
                });
                setSuccessModal({
                    visible: true,
                    title: t('login.loginSuccess'),
                });
            } else {
                // Show error in toast instead of modal
                setToastMessage(response.message || t('login.loginFailed'));
                setToastType('error');
                setToastVisible(true);
            }
        } catch (error) {
            // Show error in toast instead of modal
            setToastMessage(t('login.loginFailed'));
            setToastType('error');
            setToastVisible(true);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Farmer ID Login Flow Handlers
     */
    const handleSendFarmerIDOTP = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            // Step 1: Send OTP using Farmer ID
            const response = await sendFarmerIDOTP(farmerId);
            if (response.success) {
                // Store the mobile number and timestamp from response
                const mobile = response.mobileNo || '';
                const timestamp = response.timestamp || Date.now().toString();

                setFarmerMobileNo(mobile);
                setFarmerOTPTimestamp(timestamp);

                // Show toast notification
                setToastMessage('OTP sent successfully to registered mobile number');
                setToastType('success');
                setToastVisible(true);

                // Show OTP drawer
                setOtpDrawerVisible(true);
                setResendTimer(30);
                setCanResend(false);
            } else {
                setErrorModal({
                    visible: true,
                    message: response.message || 'Failed to send OTP. Please check your Farmer ID.',
                });
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

    const handleVerifyFarmerIDOTP = async (otp: string) => {
        setOtpLoading(true);
        try {
            // Step 2: Verify OTP and complete login
            const timestamp = farmerOTPTimestamp || Date.now().toString();
            const versionNumber = '2.0.1'; // You can make this dynamic if needed
            const deviceId = 'unknown'; // You can use react-native-device-info if needed

            const loginResponse = await verifyFarmerIDLogin(
                farmerId,
                otp,
                timestamp,
                versionNumber,
                deviceId
            );

            if (loginResponse.success && loginResponse.FAAPRegistrationID) {
                // Fetch user profile details
                const profileResponse = await getUserDetails(loginResponse.FAAPRegistrationID);

                // Save auth data
                await login({
                    mobileNo: farmerMobileNo,
                    token: loginResponse.token,
                    refreshToken: loginResponse.refresh_token,
                    FAAPRegistrationID: loginResponse.FAAPRegistrationID,
                    // Add profile data if available
                    ...(profileResponse.success && profileResponse.data ? {
                        name: profileResponse.data.Name,
                        districtName: profileResponse.data.DistrictName,
                        districtNameMr: profileResponse.data.DistrictNameMr,
                        districtCode: profileResponse.data.DistrictCode,
                        talukaName: profileResponse.data.TalukaName,
                        talukaNameMr: profileResponse.data.TalukaNameMr,
                        talukaCode: profileResponse.data.TalukaCode,
                        villageName: profileResponse.data.VillageName,
                        villageNameMr: profileResponse.data.VillageNameMr,
                        villageCode: profileResponse.data.VillageCode,
                        farmerId: profileResponse.data.farmer_id,
                        userType: profileResponse.data.user_type,
                        consent: profileResponse.data.consent,
                        isOfficers: profileResponse.data.is_officers,
                        pocraRoles: profileResponse.data.pocra_roles,
                    } : {}),
                });

                // Close drawer
                setOtpDrawerVisible(false);

                // Show success modal
                setSuccessModal({
                    visible: true,
                    title: t('login.loginSuccess'),
                    message: 'Welcome back!',
                });
            } else {
                setErrorModal({
                    visible: true,
                    message: loginResponse.message || 'Login failed. Please try again.',
                });
            }
        } catch (error) {
            setErrorModal({
                visible: true,
                message: 'Login failed. Please try again.',
            });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendFarmerIDOTP = async () => {
        setLoading(true);
        try {
            const response = await sendFarmerIDOTP(farmerId);
            if (response.success) {
                const timestamp = response.timestamp || Date.now().toString();
                setFarmerOTPTimestamp(timestamp);

                setToastMessage('OTP sent successfully');
                setToastType('success');
                setToastVisible(true);
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
                message: 'Failed to resend OTP',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('login.title')}
                subtitle={t('login.subtitle')}
                rightComponent={<LanguageSelector variant="icon" />}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Login Type Toggle - Farmer ID / Mobile No */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        onPress={() => setLoginType('farmerId')}
                        style={[
                            styles.toggleButton,
                            loginType === 'farmerId' && styles.toggleButtonActive,
                            loginType === 'farmerId' && styles.toggleLeftActive,
                        ]}
                    >
                        <Text style={[
                            styles.toggleText,
                            loginType === 'farmerId' ? styles.toggleTextActive : styles.toggleTextInactive,
                        ]}>
                            {t('login.farmerId')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setLoginType('mobile')}
                        style={[
                            styles.toggleButton,
                            loginType === 'mobile' && styles.toggleButtonActive,
                            loginType === 'mobile' && styles.toggleRightActive,

                        ]}
                    >
                        <Text style={[
                            styles.toggleText,
                            loginType === 'mobile' ? styles.toggleTextActive : styles.toggleTextInactive
                        ]}>
                            {t('login.mobileNo')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Input Field */}
                {loginType === 'mobile' ? (
                    <MobileNumberInput
                        placeholder={t('login.enterRegisteredMobile')}
                        value={mobileNo}
                        onChangeText={(text) => {
                            setMobileNo(text);
                            setErrors({ ...errors, mobile: undefined });
                        }}
                        error={errors.mobile}
                        maxLength={10}
                    />
                ) : (
                    <Input
                        placeholder={t('login.enterFarmerId')}
                        value={farmerId}
                        onChangeText={(text) => {
                            setFarmerId(text);
                            setErrors({ ...errors, farmerId: undefined });
                        }}
                        error={errors.farmerId}
                    />
                )}

                {/* Login Mode Radio Buttons - OTP / Password - Only show for Mobile Number */}
                {loginType === 'mobile' && (
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setLoginMode('otp')}
                        >
                            <View style={styles.radioButton}>
                                {loginMode === 'otp' && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.radioLabel}>{t('login.otp')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setLoginMode('password')}
                        >
                            <View style={styles.radioButton}>
                                {loginMode === 'password' && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.radioLabel}>{t('login.password')}</Text>
                        </TouchableOpacity>

                        {loginMode === 'password' && (
                            <TouchableOpacity
                                style={styles.forgotPasswordLink}
                                onPress={() => setComingSoonVisible(true)}
                            >
                                <Text style={styles.forgotPasswordText}>
                                    {t('login.forgotPasswordText')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Password Input */}
                {loginMode === 'password' && loginType === 'mobile' &&(
                    <Input
                        placeholder={t('login.password')}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrors({ ...errors, password: undefined });
                        }}
                        error={errors.password}
                        rightIcon={
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIconButton}
                            >
                                <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        }
                    />
                )}

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    <Button
                        title={loginType === 'farmerId' ? 'Send OTP' : (loginMode === 'otp' ? 'Send OTP' : 'Sign In')}
                        onPress={loginType === 'farmerId' ? handleSendFarmerIDOTP : (loginMode === 'otp' ? handleSendOTP : handlePasswordLogin)}
                        loading={loading}
                    />
                </View>
            </ScrollView>

            {/* Register Link */}
            <View style={styles.registerContainer}>
                <Text style={styles.registerPrompt}>
                    {t('login.dontHaveAccountText')}{' '}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerButtonText}>
                        {t('login.registerHere')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Coming Soon Modal */}
            <ComingSoonModal
                visible={comingSoonVisible}
                onClose={() => setComingSoonVisible(false)}
                message="Forgot password feature will be available soon."
            />

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
                type={toastType}
                onHide={() => setToastVisible(false)}
            />

            {/* OTP Bottom Drawer */}
            <OTPBottomDrawer
                visible={otpDrawerVisible}
                onClose={() => setOtpDrawerVisible(false)}
                onVerify={loginType === 'farmerId' ? handleVerifyFarmerIDOTP : handleVerifyOTP}
                onResend={loginType === 'farmerId' ? handleResendFarmerIDOTP : handleResendOTP}
                mobileNo={loginType === 'farmerId' ? farmerMobileNo : mobileNo}
                loading={otpLoading}
                resendTimer={resendTimer}
                canResend={canResend}
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
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        backgroundColor: Colors.surface,
        borderRadius: 25,
        // padding: 4,
        height: 56,
        overflow: 'hidden',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 0,
        backgroundColor: Colors.transparent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: Colors.brand.primary,
        borderRadius: 0,
    },
    toggleLeftActive: {
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
    },

    toggleRightActive: {
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
    },

    toggleText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
    },
    toggleTextActive: {
        color: Colors.white,
    },
    toggleTextInactive: {
        color: Colors.text.secondary,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.brand.primary,
    },
    radioLabel: {
        fontSize: 15,
        color: Colors.text.primary,
        fontWeight: '500',
    },
    forgotPasswordLink: {
        marginLeft: 'auto',
    },
    forgotPasswordText: {
        color: Colors.brand.primary,
        fontWeight: '500',
        fontSize: 14,
    },
    eyeIconButton: {
        padding: 4,
    },
    eyeIconText: {
        fontSize: 20,
    },
    buttonContainer: {
        marginTop: 24,
    },
    registerContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    registerPrompt: {
        color: Colors.text.secondary,
        fontSize: 14,
    },
    registerButtonText: {
        color: Colors.brand.primary,
        fontWeight: '600',
        fontSize: 14,
    },
});

