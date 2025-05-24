import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type PayoffStrategy = "snowball" | "avalanche" | "minimum";

interface StrategySelectorProps {
	selectedStrategy: PayoffStrategy;
	onStrategyChange: (strategy: PayoffStrategy) => void;
}

export function StrategySelector({
	selectedStrategy,
	onStrategyChange,
}: StrategySelectorProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Payoff Strategy</Text>
			<View style={styles.strategyContainer}>
				<TouchableOpacity
					style={[
						styles.strategyButton,
						selectedStrategy === "snowball" &&
							styles.selectedStrategy,
					]}
					onPress={() => onStrategyChange("snowball")}>
					<Text
						style={[
							styles.strategyText,
							selectedStrategy === "snowball" &&
								styles.selectedStrategyText,
						]}>
						Snowball
					</Text>
					<Text style={styles.strategyDescription}>
						Pay smallest debts first
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.strategyButton,
						selectedStrategy === "avalanche" &&
							styles.selectedStrategy,
					]}
					onPress={() => onStrategyChange("avalanche")}>
					<Text
						style={[
							styles.strategyText,
							selectedStrategy === "avalanche" &&
								styles.selectedStrategyText,
						]}>
						Avalanche
					</Text>
					<Text style={styles.strategyDescription}>
						Pay highest interest first
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.strategyButton,
						selectedStrategy === "minimum" &&
							styles.selectedStrategy,
					]}
					onPress={() => onStrategyChange("minimum")}>
					<Text
						style={[
							styles.strategyText,
							selectedStrategy === "minimum" &&
								styles.selectedStrategyText,
						]}>
						Minimum
					</Text>
					<Text style={styles.strategyDescription}>
						Pay minimum payments only
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 4,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 12,
	},
	strategyContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 8,
	},
	strategyButton: {
		flex: 1,
		backgroundColor: "white",
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
		alignItems: "center",
	},
	selectedStrategy: {
		backgroundColor: "#007AFF",
		borderColor: "#007AFF",
	},
	strategyText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	selectedStrategyText: {
		color: "white",
	},
	strategyDescription: {
		fontSize: 12,
		color: "#666",
		textAlign: "center",
	},
});
