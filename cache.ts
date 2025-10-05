import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TokenCache } from '@clerk/clerk-expo';

const createTokenCache = (): TokenCache => {
	return {
		getToken: async (key: string) => {
			try {
				const item = SecureStore.getItemAsync(key);
				if (item) {
					console.log('Item found in cache', item);
				} else {
					console.log('Item not found in cache');
				}
				return item;
			} catch (error) {
				console.error(error);
			}
		},
		saveToken: async (key: string, token: string) => {
			try {
				await SecureStore.setItemAsync(key, token);
			} catch (error) {
				console.error(error);
			}
		},
	};
};

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;
