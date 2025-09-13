import { useAuthStore } from "@/store/auth";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingProps {
	message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message }) => {
	const { logout } = useAuthStore();
	return (
		<View style={styles.container}>
			<ActivityIndicator
				size='large'
				color='#007AFF'
			/>
			{message && (
				<Text
					onPress={() => logout()}
					style={styles.message}>
					{message}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	message: {
		marginTop: 16,
		fontSize: 16,
		color: "#333",
	},
});
