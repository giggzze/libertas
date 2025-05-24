import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
	const colorScheme = useColorScheme();

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
