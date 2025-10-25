import { useThemeColor } from "@/src/hooks/use-theme-color";
import { PayoffStrategy } from "@/src/types/STT";
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
	const backgroundColor = useThemeColor( "background");
	const textColor = useThemeColor( "text");
	const tintColor = useThemeColor("tint");
	const borderColor = useThemeColor( "border");
	const contrastTextColor = useThemeColor("contrastText");

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
							borderColor: borderColor,
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
								{ color: contrastTextColor },
							],
						]}>
						Snowball
					</Text>
					<Text
						style={[
							styles.strategyDescription,
							{ color: textColor },
							selectedStrategy === "snowball" && [
								styles.selectedStrategyText,
								{ color: contrastTextColor },
							],
						]}>
						Pay smallest debts first
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.strategyButton,
						{
							backgroundColor,
							borderColor: borderColor,
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
								{ color: contrastTextColor },
							],
						]}>
						Avalanche
					</Text>
					<Text
						style={[
							styles.strategyDescription,
							{ color: textColor },
							selectedStrategy === "avalanche" && [
								styles.selectedStrategyText,
								{ color: contrastTextColor },
							],
						]}>
						Pay highest interest first
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.strategyButton,
						{
							backgroundColor,
							borderColor: borderColor,
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
								{ color: contrastTextColor },
							],
						]}>
						Minimum
					</Text>
					<Text
						style={[
							styles.strategyDescription,
							{ color: textColor },
							selectedStrategy === "minimum" && [
								styles.selectedStrategyText,
								{ color: contrastTextColor },
							],
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
