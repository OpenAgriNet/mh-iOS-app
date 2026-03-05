import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { AppText } from '../../components/common/AppText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

interface Partner {
    nameKey: string;
    id: string;
    image?: any;
}

const PARTNERS_LIST = [
    { id: '1', nameKey: 'partners.names.mpkv', image: require('../../assets/images/mpkv_logo.jpg') },
    { id: '2', nameKey: 'partners.names.pdkv', image: require('../../assets/images/pdkv_akola_ic.png') },
    { id: '3', nameKey: 'partners.names.vnmkv', image: require('../../assets/images/cnmkv_ic.png') },
    { id: '4', nameKey: 'partners.names.bskkv', image: require('../../assets/images/bskv_ic.png') },
    { id: '5', nameKey: 'partners.names.nanaji', image: require('../../assets/images/pocra_latest_logo.jpeg') },
    { id: '6', nameKey: 'partners.names.ekstep', image: require('../../assets/images/ek_step_ic.png') },
    { id: '7', nameKey: 'partners.names.fide', image: require('../../assets/images/fide_ic.png') },
    { id: '8', nameKey: 'partners.names.coss', image: require('../../assets/images/coss_ic.png') },
    { id: '9', nameKey: 'partners.names.imd', image: require('../../assets/images/ic_imd.jpeg') },
    { id: '10', nameKey: 'partners.names.mahavedh', image: require('../../assets/images/mahavedh_ic.jpg') },
    { id: '11', nameKey: 'partners.names.msamb', image: require('../../assets/images/ic_msamb.jpeg') },
    { id: '12', nameKey: 'partners.names.mswc', image: require('../../assets/images/ic_mswc.jpeg') },
    { id: '13', nameKey: 'partners.names.wotr', image: require('../../assets/images/wotr_icon.jpeg') },
    { id: '14', nameKey: 'partners.names.pani', image: require('../../assets/images/pani_foundation_logo.png') },
    { id: '15', nameKey: 'partners.names.animalHusbandry', image: require('../../assets/images/animal_husbandry_logo.png') },
    { id: '16', nameKey: 'partners.names.fisheries', image: require('../../assets/images/matsyavyavasay_icon.jpeg') },
    { id: '17', nameKey: 'partners.names.worldBank', image: require('../../assets/images/ic_world_bank.png') },
];

export const AboutScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText style={styles.backButtonIcon} color="#fff" variant="xxl" weight="bold">←</AppText>
                </TouchableOpacity>
                <AppText style={styles.headerTitle} color="#fff" variant="xl" weight="semibold">{t('about.title')}</AppText>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <Image
                        source={require('../../assets/images/mahavistaar-Ai.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <AppText style={styles.logoText} color="#009640" variant="lg" weight="bold">{t('dashboard.appName')}</AppText>
                </View>

                {/* About Text Section */}
                <View style={styles.textSection}>
                    <AppText style={styles.subHeader1} color={Colors.gray[600]} variant="lg" weight="semibold">{t('about.subHeader')}</AppText>
                    <AppText style={styles.description} align="justify" variant="sm" color="#333">
                        {t('about.description')}
                    </AppText>
                </View>

                <View style={styles.divider} />

                {/* Partners Section */}
                <View style={styles.partnersSection}>
                    <AppText style={styles.subHeader} color={Colors.gray[600]} variant="lg" weight="semibold">{t('about.ourPartners')}</AppText>
                    <View style={styles.grid}>
                        {PARTNERS_LIST.map((partner) => (
                            <View key={partner.id} style={styles.partnerItem}>
                                <View style={styles.logoPlaceholder}>
                                    {partner.image ? (
                                        <Image source={partner.image} style={styles.partnerLogo} resizeMode="contain" />
                                    ) : (
                                        <AppText style={styles.placeholderText} color="#888" variant="xl" weight="bold">{t(partner.nameKey).charAt(0)}</AppText>
                                    )}
                                </View>
                                <AppText style={styles.partnerName} variant="md" color="#333" align="center">{t(partner.nameKey)}</AppText>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

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
    backButtonIcon: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 28,
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
    },
    scrollContent: {
        paddingTop: 32,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoOuter: {
        width: 96,
        height: 96,
        backgroundColor: Colors.white,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 2,
        borderColor: Colors.brand.primary,
        overflow: 'hidden',
        marginBottom: 12,
    },
    logoImage: {
        width: 100,
        height: 100,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.brand.primary,
        marginTop: 8,
    },
    textSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.gray[600], // Slightly lighter than pure black for headers often
        marginBottom: 12,
        marginHorizontal: 20,
    },
    subHeader1: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.gray[600], // Slightly lighter than pure black for headers often
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#333',
        textAlign: 'justify',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 16,
        marginHorizontal: 20,
    },
    partnersSection: {
        marginTop: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    partnerItem: {
        width: ITEM_WIDTH - 8,
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: Colors.white,
        borderRadius: 12,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.gray[100],
        overflow: 'hidden',
    },
    partnerLogo: {
        width: '85%',
        height: '85%',
    },
    placeholderText: {
        fontSize: 20,
        color: Colors.gray[400],
        fontWeight: 'bold',
    },
    partnerName: {
        fontSize: 12,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 4,
    },
});
