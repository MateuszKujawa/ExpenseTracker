import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const AddExpenseScreen = ({ navigation, route }) => {
  const [description, setDescription] = useState(route.params?.description || '');
  const [amount, setAmount] = useState(route.params?.amount ? String(route.params.amount) : '');

  const saveExpense = async () => {
    if (!description || !amount) {
      Alert.alert('Error', 'Please enter both description and amount');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.104:5000/api/expenses', {
        description,
        amount: parseFloat(amount),
      });

      // Update balance
      const balanceResponse = await axios.get('http://192.168.1.104:5000/api/balance');
      const newBalance = balanceResponse.data.amount - parseFloat(amount);
      await axios.put('http://192.168.1.104:5000/api/balance', { amount: newBalance });

      navigation.goBack();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tytuł</Text>
      <TextInput
        style={styles.input}
        placeholder="Wpisz tytuł..."
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Kwota</Text>
      <TextInput
        style={styles.input}
        placeholder="Wprowadź kwotę..."
        placeholderTextColor="#666"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveExpense}>
        <Text style={styles.saveButtonText}>Zapisz wydatek</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(38,0,77,1) 100%)',
  },
  input: {
    height: 40,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;