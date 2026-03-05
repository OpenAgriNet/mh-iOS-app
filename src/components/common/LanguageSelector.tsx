import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, ViewStyle, Image } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { LANGUAGES } from '../../i18n/config';
import { Colors } from '../../theme/colors';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  variant?: 'button' | 'icon';
  buttonStyle?: ViewStyle;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'button',
  buttonStyle
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const currentLang = LANGUAGES.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setModalVisible(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          variant === 'icon' ? styles.iconButton : styles.button,
          buttonStyle
        ]}
      >
        {variant === 'icon' ? (
          <Image
            source={require('../../assets/images/header-language.png')}
            style={styles.iconImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.buttonText}>
            {currentLang?.nativeLabel || 'Language'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('login.selectLanguage')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Language Options */}
            <ScrollView style={styles.languageList}>
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => handleLanguageChange(language.code)}
                  style={[
                    styles.languageItem,
                    currentLanguage === language.code && styles.languageItemSelected
                  ]}
                >
                  <View>
                    <Text style={styles.languageNativeLabel}>
                      {language.nativeLabel}
                    </Text>
                    <Text style={styles.languageLabel}>
                      {language.label}
                    </Text>
                  </View>
                  {currentLanguage === language.code && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: Colors.whiteOpacity(0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.brand.primary,
    borderRadius: 8,
  },
  iconButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.blackOpacity(0.5),
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.text.muted,
  },
  languageList: {
    maxHeight: 384,
  },
  languageItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[50],
  },
  languageItemSelected: {
    backgroundColor: Colors.whiteOpacity(0.05),
  },
  languageNativeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  languageLabel: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.white,
    fontSize: 12,
  },
});

