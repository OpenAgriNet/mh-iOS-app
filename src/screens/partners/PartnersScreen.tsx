import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { AppText } from '../../components/common/AppText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BackIcon from '../../assets/icons/ic_chevron_left.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Partners'>;

interface Partner {
    nameKey: string;
    id: string;
    image: any;
}

interface Section {
    titleKey: string;
    partners: Partner[];
}

const PARTNERS_DATA: Section[] = [
    {
        titleKey: 'partners.sections.initiativeBy',
        partners: [
            { id: '1', nameKey: 'partners.names.agriDept', image: require('../../assets/images/krishi_dept_icon.png') },
            { id: '2', nameKey: 'partners.names.animalHusbandry', image: require('../../assets/images/animal_husbandry_logo.png') },
            { id: '3', nameKey: 'partners.names.fisheries', image: require('../../assets/images/matsyavyavasay_icon.jpeg') },
        ]
    },
    {
        titleKey: 'partners.sections.worldBank',
        partners: [
            { id: 'worldbank', nameKey: 'partners.names.worldBank', image: require('../../assets/images/ic_world_bank.png') },
        ]
    },
    {
        titleKey: 'partners.sections.developedBy',
        partners: [
            { id: 'nanaji', nameKey: 'partners.names.nanaji', image: require('../../assets/images/pocra_latest_logo.jpeg') },
        ]
    },
    {
        titleKey: 'partners.sections.knowledgePartners',
        partners: [
            { id: 'mpkv', nameKey: 'partners.names.mpkv', image: require('../../assets/images/mpkv_logo.jpg') },
            { id: 'pdkv', nameKey: 'partners.names.pdkv', image: require('../../assets/images/pdkv_akola_ic.png') },
            { id: 'vnmkv', nameKey: 'partners.names.vnmkv', image: require('../../assets/images/cnmkv_ic.png') },
            { id: 'bskkv', nameKey: 'partners.names.bskkv', image: require('../../assets/images/bskv_ic.png') },
            { id: 'wotr', nameKey: 'partners.names.wotr', image: require('../../assets/images/wotr_icon.jpeg') },
            { id: 'pani', nameKey: 'partners.names.pani', image: require('../../assets/images/pani_foundation_logo.png') },
        ]
    },
    {
        titleKey: 'partners.sections.techSupportPartners',
        partners: [
            { id: 'ekstep', nameKey: 'partners.names.ekstep', image: require('../../assets/images/ek_step_ic.png') },
            { id: 'fide', nameKey: 'partners.names.fide', image: require('../../assets/images/fide_ic.png') },
            { id: 'coss', nameKey: 'partners.names.coss', image: require('../../assets/images/coss_ic.png') },
        ]
    },
    {
        titleKey: 'partners.sections.dataCollaborationPartners',
        partners: [
            { id: 'imd', nameKey: 'partners.names.imd', image: require('../../assets/images/ic_imd.jpeg') },
            { id: 'mahavedh', nameKey: 'partners.names.mahavedh', image: require('../../assets/images/mahavedh_ic.jpg') },
            { id: 'msamb', nameKey: 'partners.names.msamb', image: require('../../assets/images/ic_msamb.jpeg') },
            { id: 'mswc', nameKey: 'partners.names.mswc', image: require('../../assets/images/ic_mswc.jpeg') },
        ]
    }
];

export const PartnersScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackIcon color={Colors.white} width={24} height={24} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle} color="#fff" variant="xl" weight="semibold">{t('partners.title')}</AppText>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
                {PARTNERS_DATA.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.section}>
                        {t(section.titleKey) ? (
                            <View style={styles.sectionHeader}>
                                <AppText style={styles.sectionTitle} weight="semibold" variant="lg" color={Colors.text.primary}>
                                    {t(section.titleKey)}
                                </AppText>
                            </View>
                        ) : null}

                        <View style={[styles.grid, t(section.titleKey) === t('partners.sections.developedBy') && { justifyContent: 'center' }]}>
                            {section.partners.map((partner, index) => (
                                <View key={partner.id} style={[styles.partnerItem, t(section.titleKey) === t('partners.sections.developedBy') && { width: '100%' }]}>
                                    <View style={styles.logoPlaceholder}>
                                        {partner.image ? (
                                            <Image source={partner.image} style={styles.partnerLogo} resizeMode="contain" />
                                        ) : (
                                            <AppText style={styles.placeholderText} variant="xxl" weight="bold" color="#888">{t(partner.nameKey).charAt(0)}</AppText>
                                        )}
                                    </View>
                                    <AppText
                                        style={styles.partnerName}
                                        variant="sm"
                                        color={Colors.text.secondary}
                                        align="center"
                                    >
                                        {t(partner.nameKey)}
                                    </AppText>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width) / 3; // 40 is padding (20 left + 20 right)

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
    },
    scrollContent: {
        paddingTop: 24,
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: -8,
    },
    sectionHeader: {
        backgroundColor: Colors.gray[50],
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: -16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: Colors.brand.primary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 4,
    },
    partnerItem: {
        width: ITEM_WIDTH - 16,
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    logoPlaceholder: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: Colors.white,
        borderRadius: 12,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.gray[100],
        overflow: 'hidden',
    },
    partnerLogo: {
        width: '95%',
        height: '95%',
    },
    placeholderText: {
        fontSize: 24,
        color: Colors.gray[400],
        fontWeight: 'bold',
    },
    partnerName: {
        fontSize: 13,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 2,
    },
});
