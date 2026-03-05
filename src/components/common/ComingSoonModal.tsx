import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { useTranslation } from 'react-i18next';

interface ComingSoonModalProps {
    visible: boolean;
    onClose: () => void;
    message?: string;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
    visible,
    onClose,
    message,
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>🚀</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{t('common.comingSoon')}</Text>

                    {/* Message */}
                    {message && (
                        <Text style={styles.message}>{message}</Text>
                    )}

                    {/* Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.blackOpacity(0.5),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.brand.light,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        fontSize: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: Colors.text.muted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        backgroundColor: Colors.brand.primary,
        paddingHorizontal: 48,
        paddingVertical: 14,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

