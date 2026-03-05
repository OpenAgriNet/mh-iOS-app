import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Dropdown, DropdownOption } from '../../components/common/Dropdown';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { Colors } from '../../theme/colors';
import { completeRegistration } from '../../services/api/authService';
import { getAllDistricts, getTalukaOnDistrict, getVillageOnTaluka } from '../../services/api/masterService';
import { SuccessModal } from '../../components/common/SuccessModal';
import { ErrorModal } from '../../components/common/ErrorModal';
import { useLanguage } from '../../contexts/LanguageContext';

type UserInformationRouteProp = RouteProp<RootStackParamList, 'UserInformation'>;

export const UserInformationScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<UserInformationRouteProp>();
    const { t } = useTranslation();
    const { currentLanguage } = useLanguage();

    const { mobileNo, name: initialName } = route.params;

    const [name, setName] = useState(initialName || '');
    const [email, setEmail] = useState('');
    const [districtCode, setDistrictCode] = useState<number | undefined>();
    const [talukaCode, setTalukaCode] = useState<number | undefined>();
    const [villageCode, setVillageCode] = useState<number | undefined>();

    // Dynamic data from API
    const [districts, setDistricts] = useState<DropdownOption[]>([]);
    const [talukas, setTalukas] = useState<DropdownOption[]>([]);
    const [villages, setVillages] = useState<DropdownOption[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingTalukas, setLoadingTalukas] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);

    const [errors, setErrors] = useState<{
        name?: string;
        district?: string;
        taluka?: string;
        village?: string;
    }>({});
    const [successModal, setSuccessModal] = useState<{ visible: boolean; title: string; message?: string }>({
        visible: false,
        title: '',
        message: '',
    });
    const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: '',
    });

    // Fetch districts on component mount and when language changes
    useEffect(() => {
        fetchDistricts();
    }, [currentLanguage]);

    const fetchDistricts = async () => {
        setLoadingDistricts(true);
        try {
            const response = await getAllDistricts(currentLanguage);
            if (response.success && response.data) {
                const districtOptions: DropdownOption[] = response.data.map(district => ({
                    label: district.name,
                    value: district.code,
                }));
                setDistricts(districtOptions);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchTalukas = async (districtCode: number) => {
        setLoadingTalukas(true);
        try {
            const response = await getTalukaOnDistrict(currentLanguage, districtCode);
            if (response.success && response.data) {
                const talukaOptions: DropdownOption[] = response.data.map(taluka => ({
                    label: taluka.name,
                    value: taluka.code,
                }));
                setTalukas(talukaOptions);
            }
        } catch (error) {
            console.error('Error fetching talukas:', error);
        } finally {
            setLoadingTalukas(false);
        }
    };

    const fetchVillages = async (talukaCode: number) => {
        setLoadingVillages(true);
        try {
            const response = await getVillageOnTaluka(currentLanguage, talukaCode);
            if (response.success && response.data) {
                const villageOptions: DropdownOption[] = response.data.map(village => ({
                    label: village.name,
                    value: village.code,
                }));
                setVillages(villageOptions);
            }
        } catch (error) {
            console.error('Error fetching villages:', error);
        } finally {
            setLoadingVillages(false);
        }
    };

    const validateInputs = (): boolean => {
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = 'Please enter your name';
        }

        if (!districtCode) {
            newErrors.district = 'Please select a district';
        }

        if (!talukaCode) {
            newErrors.taluka = 'Please select a taluka';
        }

        if (!villageCode) {
            newErrors.village = 'Please select a village';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const selectedDistrict = districts.find(d => d.value === districtCode);
            const selectedTaluka = talukas.find(t => t.value === talukaCode);
            const selectedVillage = villages.find(v => v.value === villageCode);

            const response = await completeRegistration(mobileNo, {
                Name: name.trim(),
                EmailId: email.trim() || '',
                DistrictName: selectedDistrict?.label || '',
                DistrictCode: districtCode!,
                TalukaName: selectedTaluka?.label || '',
                TalukaCode: talukaCode!,
                VillageName: selectedVillage?.label || '',
                VillageCode: villageCode!.toString(),
                Status: 'Active',
                version_number: '1.2',
                fcm_token: '',
                device_id: '',
                FAAPRegistrationID: '',
            });

            if (response.success) {
                setSuccessModal({
                    visible: true,
                    title: 'Registration Successful',
                    message: 'Please login to continue',
                });

                // Navigate to Login screen after a short delay
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 1500);
            } else {
                setErrorModal({
                    visible: true,
                    message: response.message || 'Registration failed. Please try again.',
                });
            }
        } catch (error) {
            setErrorModal({
                visible: true,
                message: 'Registration failed. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDistrictChange = (option: DropdownOption) => {
        const newDistrictCode = option.value as number;
        setDistrictCode(newDistrictCode);
        setTalukaCode(undefined);
        setVillageCode(undefined);
        setTalukas([]);
        setVillages([]);
        setErrors({ ...errors, district: undefined });

        // Fetch talukas for the selected district
        fetchTalukas(newDistrictCode);
    };

    const handleTalukaChange = (option: DropdownOption) => {
        const newTalukaCode = option.value as number;
        setTalukaCode(newTalukaCode);
        setVillageCode(undefined);
        setVillages([]);
        setErrors({ ...errors, taluka: undefined });

        // Fetch villages for the selected taluka
        fetchVillages(newTalukaCode);
    };

    const handleVillageChange = (option: DropdownOption) => {
        setVillageCode(option.value as number);
        setErrors({ ...errors, village: undefined });
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('register.title')}
                subtitle={t('register.subtitle')}
                onBack={() => navigation.goBack()}
            />

            {/* Language Selector in top right */}
            <View style={styles.languageSelector}>
                <LanguageSelector variant="icon" />
            </View>

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

                <Input
                    placeholder={t('register.emailPlaceholder')}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.phoneRow}>
                    <View style={styles.phoneInput}>
                        <Text style={styles.phoneText}>{mobileNo}</Text>
                    </View>
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓ Verified</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>
                    {t('register.locationInfo')}
                </Text>

                <Dropdown
                    placeholder={loadingDistricts ? 'Loading districts...' : t('userInfo.districtPlaceholder')}
                    value={districtCode}
                    options={districts}
                    onSelect={handleDistrictChange}
                    error={errors.district}
                    disabled={loadingDistricts}
                />

                <Dropdown
                    placeholder={loadingTalukas ? 'Loading talukas...' : t('userInfo.talukaPlaceholder')}
                    value={talukaCode}
                    options={talukas}
                    onSelect={handleTalukaChange}
                    error={errors.taluka}
                    disabled={!districtCode || loadingTalukas}
                />

                <Dropdown
                    placeholder={loadingVillages ? 'Loading villages...' : t('userInfo.villagePlaceholder')}
                    value={villageCode}
                    options={villages}
                    onSelect={handleVillageChange}
                    error={errors.village}
                    disabled={!talukaCode || loadingVillages}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title={t('register.register')}
                        onPress={handleRegister}
                        loading={loading}
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
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    phoneInput: {
        flex: 1,
        marginRight: 8,
        paddingHorizontal: 16,
        height: 48,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        justifyContent: 'center',
    },
    phoneText: {
        fontSize: 16,
        color: Colors.text.primary,
    },
    verifiedBadge: {
        height: 48,
        paddingHorizontal: 16,
        backgroundColor: Colors.brand.light,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.brand.primary,
    },
    verifiedText: {
        color: Colors.brand.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    buttonContainer: {
        marginTop: 24,
    },
});
