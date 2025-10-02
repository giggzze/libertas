import { ID, Permission, Role, Query } from 'react-native-appwrite';
import { useEffect, useState } from 'react';
import { tablesDB } from '@/utils/appwrite';
import Toast from '@/components/ui/Toast';
import { View, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export const IDEAS_DATABASE_ID = '68de94840012f0226a0f'; // Replace with your database ID
export const IDEAS_TABLE_ID = 'debt'; // Replace with your table ID

export default function TestScreen() {
	const [ideas, setIdeas] = useState<any[]>([]);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [toastType, setToastType] = useState<'success' | 'error'>('success');

	async function add(idea) {
		try {
			const response = await tablesDB.createRow({
				databaseId: IDEAS_DATABASE_ID,
				tableId: IDEAS_TABLE_ID,
				rowId: ID.unique(),
				data: { ...idea, userId: 'test-user' }, // Add userId
				permissions: [Permission.write(Role.user('test-user'))],
			});
			setToastMessage('Ideas added');
			setToastType('success');
			setToastVisible(true);
			setIdeas((ideas) => [response, ...ideas].slice(0, 10));
		} catch (error) {
			console.log(error);
			setToastMessage('Error adding idea');
			setToastType('error');
			setToastVisible(true);
		}
	}

	async function remove(id) {
		try {
			await tablesDB.deleteRow({
				databaseId: IDEAS_DATABASE_ID,
				tableId: IDEAS_TABLE_ID,
				rowId: id,
			});
			setToastMessage('Idea removed');
			setToastType('success');
			setToastVisible(true);
			setIdeas((ideas) => ideas.filter((idea) => idea.$id !== id));
			await init(); // Refetch ideas to ensure we have 10 items
		} catch (error) {
			setToastMessage('Error removing idea');
			setToastType('error');
			setToastVisible(true);
		}
	}

	async function init() {
		const response = await tablesDB.listRows({
			databaseId: IDEAS_DATABASE_ID,
			tableId: IDEAS_TABLE_ID,
			queries: [Query.orderDesc('$createdAt'), Query.limit(10)],
		});
		setIdeas(response.rows);
	}

	useEffect(() => {
		init();
	}, []);

	return (
		<View style={{ flex: 1, padding: 20, marginTop: 150 }}>
			<TouchableOpacity onPress={() => add({ name: 'Idea 1' })} style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10 }}>
				<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Add Idea</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => remove('1')} style={{ backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, marginBottom: 20 }}>
				<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Remove Idea</Text>
			</TouchableOpacity>

			<ThemedText>{ideas.map((idea) => idea.name).join(', ')}</ThemedText>

			<Toast message={toastMessage} type={toastType} visible={toastVisible} duration={4000} onHide={() => setToastVisible(false)} />
		</View>
	);
}
