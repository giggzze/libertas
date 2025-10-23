import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/src/hooks/use-theme-color";

interface ProgressBarProps {
    healthColor: string;
    incomeUsagePercentage: number;
}

export const ProgressBar = ({ healthColor, incomeUsagePercentage }: ProgressBarProps) => {
    const progressBarColor = useThemeColor("progress");

    return (
        <View style={[styles.progressBarContainer, { backgroundColor: progressBarColor }]}>
            <View
                style={[
                    styles.progressBarFill,
                    {
                        width: `${Math.min(incomeUsagePercentage, 100)}%`,
                        backgroundColor: healthColor
                    }
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarContainer: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden"
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 4
    }
});
