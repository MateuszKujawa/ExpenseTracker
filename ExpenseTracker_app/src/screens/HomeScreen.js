import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Function to format number with commas
  const formatNumber = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Function to load expenses from API
  const loadExpenses = async () => {
    try {
      const response = await axios.get('http://192.168.1.104:5000/api/expenses');
      setExpenses(response.data);
      const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  // Function to load balance from API
  const loadBalance = async () => {
    try {
      const response = await axios.get('http://192.168.1.104:5000/api/balance');
      if (response.data) {
        setBalance(response.data.amount);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  // Use focus effect to load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
      loadBalance();
    }, [])
  );

  const chartData = {
    labels: expenses.map(expense => expense.description),
    datasets: [
      {
        data: expenses.map(expense => expense.amount),
      },
    ],
  };

  return (
    <LinearGradient
      colors={['#2a004f', '#000000', '#2a004f']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.glassContainer}>
          <Text style={styles.balanceText}>Saldo konta:</Text>
          <TouchableOpacity 
            style={styles.editIcon} 
            onPress={() => navigation.navigate('ChangeBalance')}
          >
            <Ionicons name="pencil" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.balanceAmount}>{formatNumber(balance)} zł</Text>
        </View>
        <View style={styles.glassContainer}>
          <Text style={styles.chartTitle}>Wydatki</Text>
          <ScrollView horizontal>
            <BarChart
              data={chartData}
              width={screenWidth * 1.5} // Możliwość przewijania wykresu
              height={300} // Zwiększona wysokość wykresu
              fromZero
              showValuesOnTopOfBars
              chartConfig={{
                backgroundColor: '#000033',
                backgroundGradientFrom: '#000000',
                backgroundGradientTo: '#17153B',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.5, // Adjust bar spacing
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              style={styles.chartStyle}
              verticalLabelRotation={30}
            />
          </ScrollView>
        </View>
        <View style={styles.glassContainer}>
          <Text style={styles.recentExpensesTitle}>Ostatnie wydatki</Text>
          {expenses.length > 0 ? (
            <View style={styles.expensesListContainer}>
              <ScrollView nestedScrollEnabled>
                {expenses.map((expense) => (
                  <TouchableOpacity
                    key={expense._id}
                    style={styles.expenseItem}
                    onPress={() => navigation.navigate('Expenses')}
                  >
                    <Text style={styles.itemDescription}>{expense.description}</Text>
                    <Text style={styles.itemAmount}>{formatNumber(expense.amount)} zł</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Brak danych</Text>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => navigation.navigate('AddExpense')}
              >
                <Ionicons name="add-circle-outline" size={32} color="#007BFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Define the styles for the components
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  glassContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(22, 22, 22, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B70F5',
    marginTop: 8,
  },
  recentExpensesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  expensesListContainer: {
    maxHeight: 200, // Limiting height to show only a few items initially
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemDescription: {
    fontSize: 16,
    color: '#ffffff',
  },
  itemAmount: {
    fontSize: 16,
    color: '#ffffff',
  },
  noDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  addButton: {
    marginLeft: 16,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  chartStyle: {
    borderRadius: 16,
    marginLeft: 0,
  },
});

export default HomeScreen;
