import { useAuthStore } from "@/store/auth";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Loading } from "@/components/ui/Loading";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
	const { user, loading } = useAuthStore();
	const router = useRouter();
	const colorScheme = useColorScheme();

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/auth/Login");
		}
	}, [user, loading]);

	if (loading) {
		// Optionally show a splash/loading screen
		return <Loading />;
	}

	if (!user) return null;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#007AFF",
				tabBarInactiveTintColor: "#666",
				tabBarStyle: Platform.select({
					ios: {
						backgroundColor: "white",
						borderTopColor: "#ddd",
						position: "absolute",
					},
					default: {
						backgroundColor: "white",
						borderTopColor: "#ddd",
					},
				}),
				headerStyle: {
					backgroundColor: "white",
				},
				headerTitleStyle: {
					color: "#333",
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
		</Tabs>
	);
}
