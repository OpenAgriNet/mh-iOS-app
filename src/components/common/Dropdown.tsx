import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';

export interface DropdownOption {
    label: string;
    value: string | number;
}

interface DropdownProps {
    placeholder: string;
    value?: string | number;
    options: DropdownOption[];
    onSelect: (option: DropdownOption) => void;
    error?: string;
    containerStyle?: ViewStyle;
    disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
    placeholder,
    value,
    options,
    onSelect,
    error,
    containerStyle,
    disabled = false,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (option: DropdownOption) => {
        onSelect(option);
        setModalVisible(false);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity
                style={[
                    styles.dropdown,
                    error && styles.dropdownError,
                    disabled && styles.dropdownDisabled,
                ]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.dropdownText,
                        !selectedOption && styles.placeholderText,
                    ]}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{placeholder}</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item.value === value && styles.optionSelected,
                                    ]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            item.value === value && styles.optionTextSelected,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {item.value === value && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                            style={styles.optionsList}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 48,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    dropdownError: {
        borderColor: Colors.red[500],
    },
    dropdownDisabled: {
        opacity: 0.6,
    },
    dropdownText: {
        fontSize: 16,
        color: Colors.text.primary,
        flex: 1,
    },
    placeholderText: {
        color: Colors.text.secondary,
    },
    arrow: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginLeft: 8,
    },
    errorText: {
        color: Colors.red[500],
        fontSize: 13,
        marginTop: 4,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        width: '85%',
        maxHeight: '70%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: Colors.text.primary,
        fontWeight: '600',
    },
    optionsList: {
        maxHeight: 400,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[100],
    },
    optionSelected: {
        backgroundColor: Colors.brand.light,
    },
    optionText: {
        fontSize: 16,
        color: Colors.text.primary,
        flex: 1,
    },
    optionTextSelected: {
        color: Colors.brand.primary,
        fontWeight: '600',
    },
    checkmark: {
        fontSize: 18,
        color: Colors.brand.primary,
        fontWeight: '600',
        marginLeft: 8,
    },
});

