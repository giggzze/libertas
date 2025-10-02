import { useAuthStore } from '@/store/auth';
import { Redirect, Slot, Stack, Tabs, useRouter } from 'expo-router';
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
		// <Slot />
		<Stack
			screenOptions={{
				...(process.env.EXPO_OS !== 'ios'
					? {}
					: {
							headerLargeTitle: true,
							headerTransparent: true,
							headerBlurEffect: 'systemChromeMaterial',
							headerLargeTitleShadowVisible: false,
							headerShadowVisible: true,
							headerLargeStyle: {
								// NEW: Make the large title transparent to match the background.
								backgroundColor: 'transparent',
							},
						}),
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: 'Overview',
				}}
			/>
			<Stack.Screen name="strategy" />
			<Stack.Screen
				name="profile"
				options={{
					presentation: 'formSheet',
					headerTitle: 'Settings',
					sheetGrabberVisible: false,
					headerLargeTitle: false,
					headerShown: true,
					sheetAllowedDetents: [0.55],
				}}
			/>
		</Stack>
	);
}
