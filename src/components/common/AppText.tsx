import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface AppTextProps extends TextProps {
    variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const AppText: React.FC<AppTextProps> = ({
    children,
    style,
    variant = 'md',
    weight = 'regular',
    color = Colors.text.primary,
    align = 'left',
    ...props
}) => {
    return (
        <Text
            style={[
                styles.text,
                {
                    fontSize: Typography.sizes[variant],
                    // Use the specific font family for the requested weight
                    fontFamily: Typography.fontFamilies[weight],
                    color: color,
                    textAlign: align,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        // Base text styles if any
    },
});
