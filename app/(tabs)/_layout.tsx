import { useAuthStore } from '@/store/auth';
import { Redirect, Slot, Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Loading } from '@/components/ui/Loading';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useUser } from '@clerk/clerk-expo';

export default function TabLayout() {
	// const { user, loading } = useAuthStore();
	const router = useRouter();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	const { user } = useUser();
	if (!user) {
		return <Redirect href="/(auth)" />;
	}

	// if (loading) {
	// 	// Optionally show a splash/loading screen
	// 	return <Loading />;
	// }

	// Set status bar style based on theme
	StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');

	if (!user) return null;

	return (
		<Slot />
		// <Tabs
		// 	screenOptions={{
		// 		tabBarActiveTintColor: tintColor,
		// 		tabBarInactiveTintColor: iconColor,
		// 		tabBarStyle: Platform.select({
		// 			ios: {
		// 				backgroundColor: backgroundColor,
		// 				borderTopColor: isDark ? '#4a5568' : '#ddd',
		// 				position: 'absolute',
		// 			},
		// 			default: {
		// 				backgroundColor: backgroundColor,
		// 				borderTopColor: isDark ? '#4a5568' : '#ddd',
		// 			},
		// 		}),
		// 		headerStyle: {
		// 			backgroundColor: backgroundColor,
		// 		},
		// 		headerTitleStyle: {
		// 			color: textColor,
		// 		},
		// 		headerShown: false,
		// 		tabBarButton: HapticTab,
		// 		tabBarBackground: TabBarBackground,
		// 	}}
		// >
		// 	<Tabs.Screen
		// 		name="index"
		// 		options={{
		// 			title: 'Debts',
		// 			tabBarIcon: ({ color }) => <IconSymbol name="creditcard" size={24} color={color} />,
		// 		}}
		// 	/>
		// 	<Tabs.Screen
		// 		name="strategy"
		// 		options={{
		// 			title: 'Strategy',
		// 			tabBarIcon: ({ color }) => <IconSymbol name="chart.bar" size={24} color={color} />,
		// 		}}
		// 	/>
		// 	<Tabs.Screen
		// 		name="profile"
		// 		options={{
		// 			title: 'Profile',
		// 			tabBarIcon: ({ color }) => <IconSymbol name="person" size={24} color={color} />,
		// 		}}
		// 	/>
		// </Tabs>
	);
}
