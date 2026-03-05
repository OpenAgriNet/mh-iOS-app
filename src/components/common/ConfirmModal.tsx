import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface ConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonColor = Colors.red[500],
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Warning Icon */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>⚠</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton, { backgroundColor: confirmButtonColor }]}
                            onPress={() => {
                                onConfirm();
                                onClose();
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: Colors.yellow[50],
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
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.gray[100],
    },
    confirmButton: {
        backgroundColor: Colors.red[500],
    },
    cancelButtonText: {
        color: Colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

