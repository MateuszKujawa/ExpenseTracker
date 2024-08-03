const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Expense schema and model
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
});

const Expense = mongoose.model('Expense', expenseSchema);

// Balance schema and model
const balanceSchema = new mongoose.Schema({
  amount: Number,
});

const Balance = mongoose.model('Balance', balanceSchema);

// Routes
app.get('/api/expenses', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
  const { description, amount } = req.body;
  const newExpense = new Expense({ description, amount });
  await newExpense.save();
  res.json(newExpense);
});

app.put('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount } = req.body;
  const updatedExpense = await Expense.findByIdAndUpdate(id, { description, amount }, { new: true });
  res.json(updatedExpense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  await Expense.findByIdAndDelete(id);
  res.json({ message: 'Expense deleted' });
});

app.get('/api/balance', async (req, res) => {
  const balance = await Balance.findOne();
  res.json(balance);
});

app.post('/api/balance', async (req, res) => {
  const { amount } = req.body;
  const newBalance = new Balance({ amount });
  await newBalance.save();
  res.json(newBalance);
});

app.put('/api/balance', async (req, res) => {
  const { amount } = req.body;
  const updatedBalance = await Balance.findOneAndUpdate({}, { amount }, { new: true, upsert: true });
  res.json(updatedBalance);
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});