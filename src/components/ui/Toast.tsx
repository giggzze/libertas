import React, { useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "@/src/hooks/use-theme-color";

interface ToastProps {
    message: string;
    type?: "error" | "success" | "info" | "warning";
    visible: boolean;
    duration?: number;
    onHide?: () => void;
}

export default function Toast({ message, type = "error", visible, duration = 4000, onHide }: ToastProps) {
    const backgroundColor = useThemeColor("background");
    const textColor = useThemeColor("text");

    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(-100);

    useEffect(() => {
        if (visible) {
            // Show animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(() => {
            onHide?.();
        });
    };

    const getToastStyle = () => {
        switch (type) {
            case "success":
                return styles.successToast;
            case "warning":
                return styles.warningToast;
            case "info":
                return styles.infoToast;
            default:
                return styles.errorToast;
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "success":
                return "#10B981";
            case "warning":
                return "#F59E0B";
            case "info":
                return "#3B82F6";
            default:
                return "#EF4444";
        }
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <View style={[styles.toast, getToastStyle(), { backgroundColor }]}>
                <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
                    <Text
                        style={styles.icon}>{type === "success" ? "✓" : type === "warning" ? "⚠" : type === "info" ? "ℹ" : "✕"}</Text>
                </View>
                <Text style={[styles.message, { color: textColor }]} numberOfLines={2}>
                    {message}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 140,
        left: 16,
        right: 16,
        zIndex: 1000
    },
    toast: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderLeftWidth: 4
    },
    errorToast: {
        borderLeftColor: "#EF4444"
    },
    successToast: {
        borderLeftColor: "#10B981"
    },
    warningToast: {
        borderLeftColor: "#F59E0B"
    },
    infoToast: {
        borderLeftColor: "#3B82F6"
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    icon: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold"
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: "500"
    }
});
