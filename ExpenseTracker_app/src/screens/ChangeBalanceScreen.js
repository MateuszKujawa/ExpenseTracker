import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ChangeBalanceScreen = ({ navigation }) => {
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const response = await axios.get('http://192.168.1.104:5000/api/balance');
        if (response.data) {
          setBalance(formatNumber(response.data.amount.toString()));
        }
      } catch (error) {
        console.error('Error loading balance:', error);
      }
    };

    loadBalance();
  }, []);

  const saveBalance = async () => {
    const numericBalance = parseFloat(balance.replace(/,/g, ''));
    if (!numericBalance) {
      Alert.alert('Error', 'Please enter the balance amount');
      return;
    }

    try {
      const response = await axios.put('http://192.168.1.104:5000/api/balance', {
        amount: numericBalance,
      });
      console.log('Balance saved:', response.data);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving balance:', error);
    }
  };

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleBalanceChange = (value) => {
    const numericValue = value.replace(/,/g, '');
    if (!isNaN(numericValue)) {
      setBalance(formatNumber(numericValue));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wpisz saldo</Text>
      <TextInput
        style={styles.input}
        placeholder="Wprowadź nowe saldo konta..."
        placeholderTextColor="#666"
        value={balance}
        keyboardType="numeric"
        onChangeText={handleBalanceChange}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveBalance}>
        <Text style={styles.saveButtonText}>Zapisz saldo</Text>
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

export default ChangeBalanceScreen;
