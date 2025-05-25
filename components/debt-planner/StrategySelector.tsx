import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PayoffStrategy } from "@/types/STT";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StrategySelectorProps {
	selectedStrategy: PayoffStrategy;
	onStrategyChange: (strategy: PayoffStrategy) => void;
}

export function StrategySelector({
	selectedStrategy,
	onStrategyChange,
}: StrategySelectorProps) {
	// Theme hooks
	const colorScheme = useColorScheme();
	const backgroundColor = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");
	const iconColor = useThemeColor({}, "icon");
	const isDark = colorScheme === "dark";
	return (
		<View style={styles.container}>
			<Text style={[styles.title, { color: textColor }]}>
				Payoff Strategy
			</Text>
			<View style={styles.strategyContainer}>
				<TouchableOpacity
					style={[
						styles.strategyButton,
						{
							backgroundColor,
							borderColor: isDark ? "#4a5568" : "#ddd",
						},
						selectedStrategy === "snowball" && [
							styles.selectedStrategy,
							{
								backgroundColor: tintColor,
								borderColor: tintColor,
							},
						],
					]}
					onPress={() => onStrategyChange("snowball")}>
					<Text
						style={[
							styles.strategyText,
							{ color: textColor },
							selectedStrategy === "snowball" && [
								styles.selectedStrategyText,
								{ color: isDark ? "#000" : "#fff" },
							],
						]}>
						Snowball
					</Text>
					<Text
						style={[
							styles.strategyDescription,
							{ color: iconColor },
						]}>
						Pay smallest debts first
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.strategyButton,
						{
							backgroundColor,
							borderColor: isDark ? "#4a5568" : "#ddd",
						},
						selectedStrategy === "avalanche" && [
							styles.selectedStrategy,
							{
								backgroundColor: tintColor,
								borderColor: tintColor,
							},
						],
					]}
					onPress={() => onStrategyChange("avalanche")}>
					<Text
						style={[
							styles.strategyText,
							{ color: textColor },
							selectedStrategy === "avalanche" && [
								styles.selectedStrategyText,
								{ color: isDark ? "#000" : "#fff" },
							],
						]}>
						Avalanche
					</Text>
					<Text
						style={[
							styles.strategyDescription,
							{ color: iconColor },
						]}>
						Pay highest interest first
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.strategyButton,
						{
							backgroundColor,
							borderColor: isDark ? "#4a5568" : "#ddd",
						},
						selectedStrategy === "minimum" && [
							styles.selectedStrategy,
							{
								backgroundColor: tintColor,
								borderColor: tintColor,
							},
						],
					]}
					onPress={() => onStrategyChange("minimum")}>
					<Text
						style={[
							styles.strategyText,
							{ color: textColor },
							selectedStrategy === "minimum" && [
								styles.selectedStrategyText,
								{ color: isDark ? "#000" : "#fff" },
							],
						]}>
						Minimum
					</Text>
					<Text
						style={[
							styles.strategyDescription,
							{ color: iconColor },
						]}>
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
		marginBottom: 12,
	},
	strategyContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 8,
	},
	strategyButton: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: "center",
	},
	selectedStrategy: {
		// Colors set dynamically
	},
	strategyText: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
	},
	selectedStrategyText: {
		// Color set dynamically
	},
	strategyDescription: {
		fontSize: 12,
		textAlign: "center",
	},
});
