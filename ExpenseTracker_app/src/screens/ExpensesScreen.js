import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const ExpensesScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);

  const loadExpenses = async () => {
    try {
      const response = await axios.get('http://192.168.1.104:5000/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const updateBalance = async (amount) => {
    try {
      const balanceResponse = await axios.get('http://192.168.1.104:5000/api/balance');
      const newBalance = balanceResponse.data.amount + amount;
      await axios.put('http://192.168.1.104:5000/api/balance', { amount: newBalance });
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const deleteExpense = async (id, amount) => {
    try {
      await axios.delete(`http://192.168.1.104:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      await updateBalance(amount);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const confirmDelete = (id, amount) => {
    Alert.alert(
      'Usuń wydatek',
      'Czy na pewno chcesz usunąć ten wydatek?',
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Usuń', onPress: () => deleteExpense(id, amount) },
      ],
      { cancelable: false }
    );
  };

  const editExpense = (expense) => {
    navigation.navigate('AddExpense', { description: expense.description, amount: expense.amount });
  };

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemText}>
              <Text style={styles.itemDescription}>Opis: {item.description}</Text>
              <Text style={styles.itemAmount}>Kwota: {item.amount} zł</Text>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.editButton} onPress={() => editExpense(item)}>
                <Text style={styles.buttonText}>Edytuj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id, item.amount)}>
                <Text style={styles.buttonText}>Usuń</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Text style={styles.addButtonText}>Dodaj wydatek</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(38,0,77,1) 100%)',
  },
  item: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  itemText: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 16,
    color: '#ffffff',
  },
  itemAmount: {
    fontSize: 16,
    color: '#ffffff',
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpensesScreen;
