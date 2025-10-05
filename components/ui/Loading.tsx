import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {useAuth} from "@clerk/clerk-expo";

interface LoadingProps {
	message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message }) => {
	const { signOut} = useAuth();
	return (
		<View style={styles.container}>
			<ActivityIndicator
				size='large'
				color='#007AFF'
			/>
			{message && (
				<Text
					onPress={() => signOut()}
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
