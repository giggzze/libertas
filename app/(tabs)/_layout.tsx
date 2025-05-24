import { useAuthStore } from "@/store/auth";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Loading } from "@/components/ui/Loading";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TabLayout() {
	const { user, loading } = useAuthStore();
	const router = useRouter();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	
	// Theme colors
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/auth/Login");
		}
	}, [user, loading]);

	if (loading) {
		// Optionally show a splash/loading screen
		return <Loading />;
	}
	
	// Set status bar style based on theme
	StatusBar.setBarStyle(isDark ? "light-content" : "dark-content");

	if (!user) return null;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: tintColor,
				tabBarInactiveTintColor: iconColor,
				tabBarStyle: Platform.select({
					ios: {
						backgroundColor: backgroundColor,
						borderTopColor: isDark ? "#4a5568" : "#ddd",
						position: "absolute",
					},
					default: {
						backgroundColor: backgroundColor,
						borderTopColor: isDark ? "#4a5568" : "#ddd",
					},
				}),
				headerStyle: {
					backgroundColor: backgroundColor,
				},
				headerTitleStyle: {
					color: textColor,
				},
				headerShown: true,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: "Debts",
					tabBarIcon: ({ color }) => (
						<IconSymbol
							name='creditcard'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='strategy'
				options={{
					title: "Strategy",
					tabBarIcon: ({ color }) => (
						<IconSymbol
							name='chart.bar'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<IconSymbol
							name='person'
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
