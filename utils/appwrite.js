import { Client, TablesDB, Account } from 'react-native-appwrite';

const client = new Client();
client
	.setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
	.setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) // Replace with your project ID
	.setPlatform('com.fergusonr.libertas');

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
