// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import Supabase client
import './App.css'; // TailwindCSS styles

// Welcome Page
const Welcome = () => (
  <div className="p-6 bg-gradient-to-r from-blue-900 to-blue-500 text-center text-white min-h-screen flex flex-col justify-center">
    <h1 className="text-4xl font-bold mb-6">Welcome to the Online ATM System</h1>
    <p className="text-xl mb-8">Your trusted partner in digital banking.</p>
    <div>
      <a href="/signup" className="bg-white text-blue-900 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-all">Sign Up</a>
      <a href="/login" className="bg-transparent border-2 border-white text-white px-6 py-3 ml-4 rounded-lg hover:bg-white hover:text-blue-900 transition-all">Login</a>
    </div>
  </div>
);

// Signup Page
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (!error) {
      await supabase.from('profiles').insert([{ id: supabase.auth.user()?.id, name }]);
      alert('Signup successful! Please login.');
      window.location.href = '/login'; // Redirect to login page after signup
    } else {
      setError(error.message);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-orange-600 to-orange-300 min-h-screen text-black flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-6">Create Your Account</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-3 mb-4 rounded-lg"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-3 mb-4 rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-3 mb-4 rounded-lg"
          required
        />
        <button type="submit" className="bg-blue-600 text-black w-full py-3 rounded-lg hover:bg-blue-700">Sign Up</button>
      </form>
    </div>
  );
};

// Login Page
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = '/home'; // Redirect to home page after login
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-600 min-h-screen text-black flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-6">Login to Your Account</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-3 mb-4 rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-3 mb-4 rounded-lg"
          required
        />
        <button type="submit" className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};

// Home Page
const Home = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        window.location.href = '/login';
      } else {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        setName(profile.name);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r from-green-600 to-green-300 min-h-screen text-white flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-4">Welcome, {name}!</h2>
      <p className="text-lg mb-8">Manage your finances with ease and security.</p>
      <div>
        <a href="/dashboard" className="bg-white text-green-700 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-all">Go to Transactions</a>
        <a href="/history" className="bg-transparent border-2 border-white text-white px-6 py-3 ml-4 rounded-lg hover:bg-white hover:text-green-700 transition-all">View History</a>
      </div>
    </div>
  );
};

// Transaction History Page
// Transaction History Page
const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('User not authenticated.');
        window.location.href = '/login';
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('Failed to fetch transactions.');
        console.error(fetchError);
      } else {
        setTransactions(data);
      }
    };

    fetchHistory();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-r from-red-600 to-red-300 min-h-screen text-black flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <ul className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          {transactions.map((txn) => (
            <li key={txn.id} className="border-b py-3">
              {txn.type === 'deposit' ? 'Deposited' : 'Withdrew'} $
              {Math.abs(txn.amount).toFixed(2)} on{' '}
              {new Date(txn.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Dashboard Page
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        window.location.href = '/login';
      } else {
        setUser(user);
        fetchBalance(user.id);
      }
    };
    fetchUser();
  }, []);

  const fetchBalance = async (userId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (!error) {
      const totalBalance = data.reduce((sum, transaction) => sum + transaction.amount, 0);
      setBalance(totalBalance);
    }
  };

  const handleTransaction = async (type) => {
    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      alert('Enter a valid amount.');
      return;
    }

    if (type === 'withdraw' && transactionAmount > balance) {
      alert('Insufficient balance.');
      return;
    }

    const adjustedAmount = type === 'withdraw' ? -transactionAmount : transactionAmount;

    const { error } = await supabase.from('transactions').insert([
      { user_id: user.id, amount: adjustedAmount, type },
    ]);

    if (!error) {
      setBalance(balance + adjustedAmount);
      fetchBalance(user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-300 min-h-screen text-black flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
      <p className="text-xl mb-6">Current Balance: <span className="font-bold">${balance.toFixed(2)}</span></p>
      <div className="mb-6">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border w-full max-w-sm p-3 mb-4 rounded-lg"
        />
        <div className="flex space-x-4">
          <button
            onClick={() => handleTransaction('deposit')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Deposit
          </button>
          <button
            onClick={() => handleTransaction('withdraw')}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Withdraw
          </button>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 mt-6"
      >
        Logout
      </button>
    </div>
  );
};

// Main App Component with Routing
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default App;
