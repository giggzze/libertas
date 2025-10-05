import { Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { SFSymbol } from 'expo-symbols';

interface HeaderButtonProps {
	onPress: () => void;
	iconName: SFSymbol;
	color: string;
}

export default function HeaderButton({ onPress, iconName, color }: HeaderButtonProps) {
	return (
		<Pressable onPress={onPress}>
			<IconSymbol name={iconName} color={color} />
		</Pressable>
	);
}
