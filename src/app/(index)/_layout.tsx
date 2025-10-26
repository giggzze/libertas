import { Redirect, router, Stack } from "expo-router";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { appleBlue, Colors } from "@/src/constants/theme";
import { View } from "react-native";
import HeaderButton from "@/src/components/ui/HeaderButton";

export default function TabLayout() {
    const { user } = useUser();

    if (!user) {
        return <Redirect href="/(auth)" />;
    }

    return (
        <Stack
            screenOptions={{
                ...(process.env.EXPO_OS !== "ios"
                    ? {}
                    : {
                          headerLargeTitle: false,
                          headerTransparent: true,
                          headerBlurEffect: "systemChromeMaterial",
                          headerLargeTitleShadowVisible: false,
                          headerShadowVisible: true,
                          headerLargeStyle: {
                              backgroundColor: "transparent"
                          }
                      })
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Overview",
                    headerLeft: () => (
                        <View style={{ marginLeft: 5 }}>
                            <HeaderButton onPress={() => router.push("./profile")} iconName="gear" color={appleBlue} />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={{ marginLeft: 5 }}>
                            <HeaderButton
                                onPress={() => router.push("./strategy")}
                                iconName="chart.bar"
                                color={appleBlue}
                            />
                        </View>
                    )
                }}
            />
            <Stack.Screen
                name="strategy"
                options={{
                    headerShown: true,
                    title: "Strategy",
                    headerLargeTitle: false
                }}
            />
            <Stack.Screen
                name="profile"
                options={{
                    presentation: "formSheet",
                    headerTitle: "Settings",
                    sheetGrabberVisible: false,
                    headerLargeTitle: false,
                    headerShown: true,
                    sheetAllowedDetents: [0.55]
                }}
            />
            <Stack.Screen
                name="AddExpenseModal"
                options={{
                    headerShown: false,
                    title: "Add Expense",
                    headerLargeTitle: false,
                    presentation: "formSheet",
                    sheetGrabberVisible: false,
                    sheetAllowedDetents: [0.45],
                    contentStyle: {
                        backgroundColor: Colors.light.background
                    }
                }}
            />
            <Stack.Screen
                name="EditExpenseModal"
                options={{
                    headerShown: false,
                    title: "Add Expense",
                    headerLargeTitle: false,
                    presentation: "formSheet",
                    sheetGrabberVisible: false,
                    sheetAllowedDetents: [0.45],
                    contentStyle: {
                        backgroundColor: Colors.light.background
                    }
                }}
            />
            <Stack.Screen
                name="AddDebtModal"
                options={{
                    headerShown: false,
                    title: "Add Expense",
                    headerLargeTitle: false,
                    presentation: "formSheet",
                    sheetGrabberVisible: false,
                    sheetAllowedDetents: [0.7],
                    contentStyle: {
                        backgroundColor: Colors.light.background
                    }
                }}
            />
        </Stack>
    );
}
