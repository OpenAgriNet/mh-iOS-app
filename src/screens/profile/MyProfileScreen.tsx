import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDetails, UserDetailsData, updateProfile } from '../../services/api/authService';
import { getAllDistricts, getTalukaOnDistrict, getVillageOnTaluka, District, Taluka, Village } from '../../services/api/masterService';
import { useLanguage } from '../../contexts/LanguageContext';
import { Toast } from '../../components/common/Toast';
import Svg, { Path } from 'react-native-svg';

type MyProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyProfile'>;

const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M15 18L9 12L15 6"
            stroke={Colors.white}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const ChevronDownIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <Path
            d="M5 7.5L10 12.5L15 7.5"
            stroke={Colors.gray[500]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const ChevronRightIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <Path
            d="M7.5 15L12.5 10L7.5 5"
            stroke={Colors.gray[400]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const EditIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
            stroke={Colors.white}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
            stroke={Colors.white}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const CloseIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M18 6L6 18M6 6L18 18"
            stroke={Colors.gray[500]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const MyProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<MyProfileScreenNavigationProp>();
    const { user, updateUser } = useAuth();
    const { currentLanguage } = useLanguage();

    const [profileData, setProfileData] = useState<UserDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit mode state
    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

    // Location data
    const [districts, setDistricts] = useState<District[]>([]);
    const [talukas, setTalukas] = useState<Taluka[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);

    // Selected values
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | undefined>();
    const [selectedTalukaCode, setSelectedTalukaCode] = useState<number | undefined>();
    const [selectedVillageCode, setSelectedVillageCode] = useState<number | undefined>();

    // Modal states
    const [districtModalVisible, setDistrictModalVisible] = useState(false);
    const [talukaModalVisible, setTalukaModalVisible] = useState(false);
    const [villageModalVisible, setVillageModalVisible] = useState(false);

    // Loading states
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingTalukas, setLoadingTalukas] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);

    useEffect(() => {
        fetchUserProfile();
        fetchDistricts();
    }, []);

    useEffect(() => {
        // Refetch districts when language changes
        fetchDistricts();
    }, [currentLanguage]);

    const fetchDistricts = async () => {
        setLoadingDistricts(true);
        try {
            const response = await getAllDistricts(currentLanguage);
            if (response.success && response.data) {
                setDistricts(response.data);
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
                setTalukas(response.data);
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
                setVillages(response.data);
            }
        } catch (error) {
            console.error('Error fetching villages:', error);
        } finally {
            setLoadingVillages(false);
        }
    };

    const fetchUserProfile = async () => {
        if (!user?.FAAPRegistrationID) {
            setLoading(false);
            setError('No registration ID found');
            return;
        }

        try {
            setLoading(true);
            const response = await getUserDetails(user.FAAPRegistrationID);

            if (response.success && response.data) {
                setProfileData(response.data);

                // Initialize form fields
                setName(response.data.Name || '');

                // Set selected location codes
                setSelectedDistrictCode(response.data.DistrictCode);
                setSelectedTalukaCode(response.data.TalukaCode);
                setSelectedVillageCode(response.data.VillageCode);

                // Fetch talukas and villages for the selected district and taluka
                if (response.data.DistrictCode) {
                    await fetchTalukas(response.data.DistrictCode);
                }
                if (response.data.TalukaCode) {
                    await fetchVillages(response.data.TalukaCode);
                }

                // Update user context with profile data
                await updateUser({
                    name: response.data.Name,
                    districtName: response.data.DistrictName,
                    districtNameMr: response.data.DistrictNameMr,
                    districtCode: response.data.DistrictCode,
                    talukaName: response.data.TalukaName,
                    talukaNameMr: response.data.TalukaNameMr,
                    talukaCode: response.data.TalukaCode,
                    villageName: response.data.VillageName,
                    villageNameMr: response.data.VillageNameMr,
                    villageCode: response.data.VillageCode,
                    farmerId: response.data.farmer_id,
                    userType: response.data.user_type,
                    consent: response.data.consent,
                    isOfficers: response.data.is_officers,
                    pocraRoles: response.data.pocra_roles,
                });

                setError(null);
            } else {
                setError(response.message || 'Failed to fetch profile');
            }
        } catch (err) {
            setError('An error occurred while fetching profile');
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDistrictSelect = (district: District) => {
        // Clear taluka and village when district changes
        setSelectedDistrictCode(district.code);
        setSelectedTalukaCode(undefined);
        setSelectedVillageCode(undefined);
        setTalukas([]);
        setVillages([]);
        setDistrictModalVisible(false);
        fetchTalukas(district.code);
    };

    const handleTalukaSelect = (taluka: Taluka) => {
        // Clear village when taluka changes
        setSelectedTalukaCode(taluka.code);
        setSelectedVillageCode(undefined);
        setVillages([]);
        setTalukaModalVisible(false);
        fetchVillages(taluka.code);
    };

    const handleVillageSelect = (village: Village) => {
        setSelectedVillageCode(village.code);
        setVillageModalVisible(false);
    };

    const handleEditPress = () => {
        // Don't allow edit if any required field is empty
        if (!profileData?.Name || !selectedDistrictCode || !selectedTalukaCode || !selectedVillageCode) {
            return;
        }
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        // Reset form fields to original values
        setName(profileData?.Name || '');
        setPassword('');
        setShowPasswordField(false);
        setSelectedDistrictCode(profileData?.DistrictCode);
        setSelectedTalukaCode(profileData?.TalukaCode);
        setSelectedVillageCode(profileData?.VillageCode);
        setIsEditMode(false);
    };

    const handleUpdateProfile = async () => {
        if (!user?.mobileNo || !user?.FAAPRegistrationID) {
            return;
        }

        // Validate required fields
        if (!name || !selectedDistrictCode || !selectedTalukaCode || !selectedVillageCode) {
            return;
        }

        const selectedDistrict = districts.find(d => d.code === selectedDistrictCode);
        const selectedTaluka = talukas.find(t => t.code === selectedTalukaCode);
        const selectedVillage = villages.find(v => v.code === selectedVillageCode);

        if (!selectedDistrict || !selectedTaluka || !selectedVillage) {
            return;
        }

        try {
            setIsUpdating(true);

            const profileUpdateData = {
                Name: name,
                DistrictName: selectedDistrict.name,
                DistrictCode: selectedDistrictCode,
                TalukaName: selectedTaluka.name,
                TalukaCode: selectedTalukaCode,
                VillageName: selectedVillage.name,
                VillageCode: selectedVillageCode.toString(),
                Status: 'Active',
                version_number: '1.2',
                FAAPRegistrationID: user.FAAPRegistrationID.toString(),
                ...(password && { Password: password }),
            };

            const response = await updateProfile(
                user.mobileNo,
                user.mobileNo,
                profileUpdateData
            );

            if (response.success) {
                // Update local state
                await fetchUserProfile();
                setIsEditMode(false);
                setShowPasswordField(false);
                setPassword('');
                // Show success message
                setToast({ visible: true, message: 'Profile updated successfully', type: 'success' });
            } else {
                setToast({ visible: true, message: response.message || 'Failed to update profile', type: 'error' });
            }
        } catch (error) {
            console.error('Update profile error:', error);
            setToast({ visible: true, message: 'An error occurred while updating profile', type: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    const getSelectedDistrictName = () => {
        const district = districts.find(d => d.code === selectedDistrictCode);
        return district?.name || profileData?.DistrictName || 'N/A';
    };

    const getSelectedTalukaName = () => {
        const taluka = talukas.find(t => t.code === selectedTalukaCode);
        return taluka?.name || profileData?.TalukaName || 'N/A';
    };

    const getSelectedVillageName = () => {
        const village = villages.find(v => v.code === selectedVillageCode);
        return village?.name || profileData?.VillageName || 'N/A';
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.brand.primary} />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </View>
        );
    }

    if (error && !profileData) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <BackIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={styles.headerRight}>
                    {!isEditMode && (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={handleEditPress}
                            activeOpacity={0.7}
                        >
                            <EditIcon />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Name Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Name</Text>
                        {isEditMode ? (
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter name"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        ) : (
                            <Text style={styles.value}>{profileData?.Name || user?.name || 'N/A'}</Text>
                        )}
                    </View>

                    {/* Mobile Number Field */}
                    <View style={styles.fieldContainer}>
                        <View style={styles.fieldHeader}>
                            <View>
                                <Text style={styles.label}>Mobile number</Text>
                                <Text style={styles.value}>{profileData?.MobileNo || user?.mobileNo || 'N/A'}</Text>
                            </View>
                            {!isEditMode && (
                                <TouchableOpacity style={styles.verifyButton}>
                                    <Text style={styles.verifyButtonText}>Verify</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* District Field */}
                    <TouchableOpacity
                        style={styles.fieldContainer}
                        activeOpacity={0.7}
                        onPress={() => isEditMode && setDistrictModalVisible(true)}
                        disabled={!isEditMode}
                    >
                        <Text style={styles.label}>District</Text>
                        <View style={styles.dropdownRow}>
                            <Text style={styles.value}>{getSelectedDistrictName()}</Text>
                            {isEditMode && <ChevronDownIcon />}
                        </View>
                    </TouchableOpacity>

                    {/* Taluka Field */}
                    <TouchableOpacity
                        style={styles.fieldContainer}
                        activeOpacity={0.7}
                        onPress={() => isEditMode && selectedDistrictCode && setTalukaModalVisible(true)}
                        disabled={!isEditMode || !selectedDistrictCode}
                    >
                        <Text style={styles.label}>Taluka</Text>
                        <View style={styles.dropdownRow}>
                            <Text style={[styles.value, (!isEditMode || !selectedDistrictCode) && styles.disabledText]}>
                                {getSelectedTalukaName()}
                            </Text>
                            {isEditMode && <ChevronDownIcon />}
                        </View>
                    </TouchableOpacity>

                    {/* Village Field */}
                    <TouchableOpacity
                        style={styles.fieldContainer}
                        activeOpacity={0.7}
                        onPress={() => isEditMode && selectedTalukaCode && setVillageModalVisible(true)}
                        disabled={!isEditMode || !selectedTalukaCode}
                    >
                        <Text style={styles.label}>Village</Text>
                        <View style={styles.dropdownRow}>
                            <Text style={[styles.value, (!isEditMode || !selectedTalukaCode) && styles.disabledText]}>
                                {getSelectedVillageName()}
                            </Text>
                            {isEditMode && <ChevronDownIcon />}
                        </View>
                    </TouchableOpacity>

                    {/* Reset Password */}
                    {isEditMode && (
                        <View style={styles.resetPasswordContainer}>
                            {!showPasswordField ? (
                                <TouchableOpacity
                                    style={styles.resetPasswordButton}
                                    activeOpacity={0.7}
                                    onPress={() => setShowPasswordField(true)}
                                >
                                    <Text style={styles.resetPasswordText}>Reset Password</Text>
                                    <ChevronRightIcon />
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.passwordFieldContainer}>
                                    <View style={styles.passwordInputWrapper}>
                                        <Text style={styles.label}>New Password</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={password}
                                            onChangeText={setPassword}
                                            placeholder="Enter new password"
                                            placeholderTextColor={Colors.gray[400]}
                                            secureTextEntry
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={styles.removePasswordButton}
                                        onPress={() => {
                                            setShowPasswordField(false);
                                            setPassword('');
                                        }}
                                    >
                                        <CloseIcon />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Update Profile Button - Only show in edit mode */}
            {isEditMode && (
                <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        activeOpacity={0.8}
                        onPress={handleUpdateProfile}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <Text style={styles.updateButtonText}>Update profile</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* District Selection Modal */}
            <Modal
                visible={districtModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setDistrictModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select District</Text>
                            <TouchableOpacity onPress={() => setDistrictModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalList}>
                            {loadingDistricts ? (
                                <ActivityIndicator size="large" color={Colors.brand.primary} style={styles.modalLoader} />
                            ) : (
                                districts.map((district) => (
                                    <TouchableOpacity
                                        key={district.code}
                                        style={[
                                            styles.modalItem,
                                            selectedDistrictCode === district.code && styles.modalItemSelected
                                        ]}
                                        onPress={() => handleDistrictSelect(district)}
                                    >
                                        <Text style={[
                                            styles.modalItemText,
                                            selectedDistrictCode === district.code && styles.modalItemTextSelected
                                        ]}>
                                            {district.name}
                                        </Text>
                                        {selectedDistrictCode === district.code && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Taluka Selection Modal */}
            <Modal
                visible={talukaModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setTalukaModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Taluka</Text>
                            <TouchableOpacity onPress={() => setTalukaModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalList}>
                            {loadingTalukas ? (
                                <ActivityIndicator size="large" color={Colors.brand.primary} style={styles.modalLoader} />
                            ) : (
                                talukas.map((taluka) => (
                                    <TouchableOpacity
                                        key={taluka.code}
                                        style={[
                                            styles.modalItem,
                                            selectedTalukaCode === taluka.code && styles.modalItemSelected
                                        ]}
                                        onPress={() => handleTalukaSelect(taluka)}
                                    >
                                        <Text style={[
                                            styles.modalItemText,
                                            selectedTalukaCode === taluka.code && styles.modalItemTextSelected
                                        ]}>
                                            {taluka.name}
                                        </Text>
                                        {selectedTalukaCode === taluka.code && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Village Selection Modal */}
            <Modal
                visible={villageModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setVillageModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Village</Text>
                            <TouchableOpacity onPress={() => setVillageModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalList}>
                            {loadingVillages ? (
                                <ActivityIndicator size="large" color={Colors.brand.primary} style={styles.modalLoader} />
                            ) : (
                                villages.map((village) => (
                                    <TouchableOpacity
                                        key={village.code}
                                        style={[
                                            styles.modalItem,
                                            selectedVillageCode === village.code && styles.modalItemSelected
                                        ]}
                                        onPress={() => handleVillageSelect(village)}
                                    >
                                        <Text style={[
                                            styles.modalItemText,
                                            selectedVillageCode === village.code && styles.modalItemTextSelected
                                        ]}>
                                            {village.name}
                                        </Text>
                                        {selectedVillageCode === village.code && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Toast */}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast({ ...toast, visible: false })}
            />
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        backgroundColor: Colors.brand.primary,
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    fieldContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.gray[200],
    },
    fieldHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 14,
        color: Colors.gray[600],
        marginBottom: 4,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    verifyButton: {
        backgroundColor: Colors.brand.light,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    verifyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.brand.primary,
    },
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resetPasswordButton: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: Colors.gray[200],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resetPasswordText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.gray[100],
    },
    updateButton: {
        backgroundColor: Colors.brand.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.text.secondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: Colors.brand.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    disabledText: {
        color: Colors.gray[400],
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    modalClose: {
        fontSize: 24,
        color: Colors.gray[500],
        fontWeight: '300',
    },
    modalList: {
        padding: 16,
    },
    modalLoader: {
        marginVertical: 40,
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray[200],
    },
    modalItemSelected: {
        backgroundColor: Colors.brand.light,
        borderColor: Colors.brand.primary,
    },
    modalItemText: {
        fontSize: 16,
        color: Colors.text.primary,
        flex: 1,
    },
    modalItemTextSelected: {
        color: Colors.brand.primary,
        fontWeight: '600',
    },
    checkmark: {
        fontSize: 20,
        color: Colors.brand.primary,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[300],
    },
    resetPasswordContainer: {
        marginTop: 8,
    },
    passwordFieldContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.gray[200],
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    passwordInputWrapper: {
        flex: 1,
    },
    removePasswordButton: {
        padding: 4,
        marginTop: 8,
    },
});
