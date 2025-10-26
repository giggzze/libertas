import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, TextStyle, useColorScheme, ViewStyle } from "react-native";
import { appleBlue, zincColors } from "@/src/constants/theme";
import { ThemedText } from "@/src/components/themed-text";

type ButtonVariant = "filled" | "outlined" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Button = ({
                    onPress,
                    variant = "filled",
                    size = "md",
                    children,
                    loading = false,
                    disabled = false,
                    style,
                    textStyle
                }: ButtonProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const sizeStyles: Record<ButtonSize, { height: number; fontSize: number; padding: number }> = {
        sm: { height: 36, fontSize: 14, padding: 12 },
        md: { height: 44, fontSize: 16, padding: 16 },
        lg: { height: 55, fontSize: 18, padding: 20 }
    };

    const getVariantStyle = () => {
        const baseStyle: ViewStyle = {
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
        };

        switch (variant) {
            case "filled":
                return {
                    ...baseStyle,
                    backgroundColor: isDark ? zincColors[50] : zincColors[900]
                };
            case "outlined":
                return {
                    ...baseStyle,
                    backgroundColor: "Transparent",
                    borderWidth: 1,
                    borderColor: isDark ? zincColors[700] : zincColors[300]
                };
            case "ghost":
                return {
                    ...baseStyle,
                    backgroundColor: "Transparent"
                };
        }
    };

    const getTextColor = () => {
        if (disabled) {
            return isDark ? zincColors[500] : zincColors[400];
        }

        switch (variant) {
            case "filled":
                return isDark ? zincColors[900] : zincColors[50];
            case "outlined":
            case "ghost":
                return appleBlue;
        }
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                getVariantStyle(),
                {
                    height: sizeStyles[size].height,
                    paddingHorizontal: sizeStyles[size].padding,
                    opacity: disabled ? 0.5 : 1
                },
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <ThemedText
                    style={StyleSheet.flatten([
                        {
                            fontSize: sizeStyles[size].fontSize,
                            color: getTextColor(),
                            textAlign: "center",
                            marginBottom: 0,
                            fontWeight: "700"
                        },
                        textStyle
                    ])}
                >
                    {children}
                </ThemedText>
            )}
        </Pressable>
    );
};

export default Button;
