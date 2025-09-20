import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
	MONTHLY_INCOME: "monthly_income",
} as const;

export const saveMonthlyIncome = async (income: string) => {
	try {
		await AsyncStorage.setItem(STORAGE_KEYS.MONTHLY_INCOME, income);
	} catch (error) {
		console.error("Error saving monthly income:", error);
	}
};

export const getMonthlyIncome = async (): Promise<string | null> => {
	try {
		return await AsyncStorage.getItem(STORAGE_KEYS.MONTHLY_INCOME);
	} catch (error) {
		console.error("Error getting monthly income:", error);
		return null;
	}
};
