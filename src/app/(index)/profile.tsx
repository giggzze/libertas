import { ThemedText } from '@/src/components/themed-text';
import { BodyScrollView } from '@/src/components/ui/BodyScrollView';
import Button from '@/src/components/ui/Button';
import TextInput from '@/src/components/ui/TextInput';
import { useMonthlyIncome } from '@/src/hooks/useMonthlyIncome';
import { useAuth, useUser } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const { currentIncome, createIncome } = useMonthlyIncome();
  const [newIncome, setNewIncome] = useState('');

  const handleUpdateIncome = async () => {
    if (!newIncome) return;

    const incomeNumber = Number(newIncome);
    if (isNaN(incomeNumber) || incomeNumber <= 0) {
      Alert.alert('Invalid Income', 'Please enter a valid income amount.');
      return;
    }

    try {
      await createIncome({
        amount: incomeNumber,
        start_date: new Date().toISOString().split('T')[0],
        user_id: user!.id,
      });
      setNewIncome('');
      Alert.alert('Success', 'Income updated successfully!');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update income. Please try again.');
    }
  };

  return (
    <BodyScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={[styles.header]}>
        <ThemedText style={[styles.email]}>
          {user?.emailAddresses[0].emailAddress}
        </ThemedText>
      </View>

      <View style={[styles.section]}>
        <ThemedText style={[styles.sectionTitle]}>Monthly Income</ThemedText>
        <View style={styles.incomeContainer}>
          <ThemedText style={[styles.currentIncome]}>
            Current: £{currentIncome?.amount.toLocaleString() || '0'}
          </ThemedText>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Enter new monthly income'
              keyboardType='numeric'
              value={newIncome}
              onChangeText={setNewIncome}
            />
            <Button size='sm' variant='outlined' onPress={handleUpdateIncome}>
              Update
            </Button>
          </View>
        </View>
      </View>

      <Button onPress={() => signOut()} size='sm'>
        Logout
      </Button>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    alignSelf: 'center',
    opacity: 0.7,
  },
  section: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  incomeContainer: {
    gap: 16,
  },
  currentIncome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  updateButton: {
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  updateButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
