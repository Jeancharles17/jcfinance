
import React, { Component } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { auth, db, storage } from '../Config/Fire';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import { PlaidLink } from 'react-plaid-link';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Tracker.css';

Chart.register(...registerables);

class Tracker extends Component {
    state = {
        transactions: [],
        chatInput: '',
        chatHistory: [], // New state for chat history
        isChatLoading: false, // State to handle loading status for chat
        money: 0,
        transactionType: '',
        predictedExpenses: {},
        price: '',
        date: '',
        currentUID: auth.currentUser?.uid || '',
        category: '',
        selectedMonth: new Date().toLocaleString('default', { month: 'short' }),
        totalIncome: 0,
        totalExpenses: 0,
        remainingBalance: 0,
        incomeChartData: {
            labels: [],
            datasets: [
                {
                    label: 'Income',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',   // Red
                        'rgba(54, 162, 235, 1)',   // Sky Blue
                        'rgba(255, 206, 86, 1)',   // Yellow
                        'rgba(75, 192, 192, 1)',   // Teal
                        'rgba(153, 102, 255, 1)',  // Purple
                        'rgba(255, 159, 64, 1)',   // Orange
                        'rgba(201, 203, 207, 1)',  // Gray
                        'rgba(0, 128, 0, 1)',      // Green
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',   // Red
                        'rgba(54, 162, 235, 1)',   // Sky Blue
                        'rgba(255, 206, 86, 1)',   // Yellow
                        'rgba(75, 192, 192, 1)',   // Teal
                        'rgba(153, 102, 255, 1)',  // Purple
                        'rgba(255, 159, 64, 1)',   // Orange
                        'rgba(201, 203, 207, 1)',  // Gray
                        'rgba(0, 128, 0, 1)',      // Green
                    ],
                    borderWidth: 1,
                },
            ],
        },
        expenseChartData: {
            labels: [],
            datasets: [
                {
                    label: 'Expenses',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',  // Light Pink
                        'rgba(255, 159, 64, 0.5)',   // Light Orange
                        'rgba(255, 205, 86, 0.5)',   // Light Yellow
                        'rgba(75, 192, 192, 0.5)',   // Light Teal
                        'rgba(54, 162, 235, 0.5)',   // Light Blue
                        'rgba(153, 102, 255, 0.5)',  // Light Purple
                        'rgba(255, 99, 132, 0.5)',   // Light Pink
                        'rgba(255, 206, 86, 0.5)'    // Light Yellow
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',    // Solid Pink
                        'rgba(255, 159, 64, 1)',     // Solid Orange
                        'rgba(255, 205, 86, 1)',     // Solid Yellow
                        'rgba(75, 192, 192, 1)',     // Solid Teal
                        'rgba(54, 162, 235, 1)',     // Solid Blue
                        'rgba(153, 102, 255, 1)',    // Solid Purple
                        'rgba(255, 99, 132, 1)',      // Solid Pink
                        'rgba(255, 206, 86, 1)'       // Solid Yellow
                    ],
                    borderWidth: 1,
                    
                },
            ],
        },
        spendingChartData: {
            labels: [], // Dates will be filled here
            datasets: [
                {
                    label: 'Spending',
                    data: [],
                    fill: false,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                },
            ],
        },
        profilePictureUrl: '',
        showProfileUpload: true,
        categories: {
            income: ['Salary', 'Bonus', 'Interest', 'Investment', 'Alimony', 'Stipend', 'Pension', 'Other'],
            expenses: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Medical', 'Bills', 'Other'],
        },
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        plaidToken: null,
        plaidTransactions: [],
        goalName: '',
        targetAmount: 0,
        deadline: '',
        monthlyContribution: 0,
        savingsProgress: 0,
        notifications: []
    };

    componentDidMount() {
        const { currentUID } = this.state;

        if (currentUID) {
            const transactionsRef = ref(db, `Transactions/${currentUID}`);
            onValue(transactionsRef, (snapshot) => {
                const transactions = snapshot.val() || {};
                const transactionsArray = Object.keys(transactions).map(key => ({ ...transactions[key], id: key }));
                this.setState({ transactions: transactionsArray }, () => {
                    this.updateChartData();
                    this.updateSpendingChartData();
                    this.calculatePredictedExpenses();
                });
            });
        }
    }

    handlePlaidSuccess = (publicToken, metadata) => {
        // Send the public token to your backend to exchange it for an access token
        fetch('/api/exchange_public_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_token: publicToken }),
        })
        .then((response) => response.json())
        .then((data) => {
            const accessToken = data.access_token;
            this.fetchPlaidTransactions(accessToken);
        })
        .catch((error) => {
            console.error('Error exchanging public token:', error);
        });
    };

    fetchPlaidTransactions = (accessToken) => {
        fetch('/api/get_transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ access_token: accessToken }),
        })
        .then((response) => response.json())
        .then((transactions) => {
            this.setState({ plaidTransactions: transactions });
            this.categorizePlaidTransactions();
        })
        .catch((error) => {
            console.error('Error fetching transactions:', error);
        });
    };

    categorizePlaidTransactions = () => {
        const { plaidTransactions, currentUID } = this.state;

        plaidTransactions.forEach((transaction) => {
            // Save each transaction to Firebase
            const transactionsRef = ref(db, `Transactions/${currentUID}`);
            push(transactionsRef, transaction);
        });

        this.setState((prevState) => ({
            transactions: [...prevState.transactions, ...prevState.plaidTransactions],
            plaidTransactions: [], // Clear Plaid transactions once processed
        }), () => {
            this.updateChartData();
            this.updateSpendingChartData();
        });
    };

    handlePlaidError = (error) => {
        console.error('Plaid link error:', error);
    };


    componentDidUpdate(prevProps, prevState) {
        if (this.state.profilePictureUrl !== prevState.profilePictureUrl) {
            const userRef = ref(db, `Users/${this.state.currentUID}`);
            set(userRef, {
                profilePictureUrl: this.state.profilePictureUrl,
            });
        }
    }

    clearBudget = () => {
        const confirmClear = window.confirm("Are you sure you want to clear all transactions?");
        if (confirmClear) {
            const { currentUID } = this.state;
            const transactionsRef = ref(db, `Transactions/${currentUID}`);

            remove(transactionsRef)
                .then(() => {
                    this.setState({
                        transactions: [],
                        money: 0,
                        totalIncome: 0,
                        totalExpenses: 0,
                        remainingBalance: 0,
                        incomeChartData: { ...this.state.incomeChartData, labels: [], datasets: [{ ...this.state.incomeChartData.datasets[0], data: [] }] },
                        expenseChartData: { ...this.state.expenseChartData, labels: [], datasets: [{ ...this.state.expenseChartData.datasets[0], data: [] }] },
                        spendingChartData: { ...this.state.spendingChartData, labels: [], datasets: [{ ...this.state.spendingChartData.datasets[0], data: [] }] },
                    });
                })
                .catch((error) => {
                    console.error("Error clearing transactions: ", error);
                });
        }
    };

    logout = () => {
        auth.signOut();
    };

    handleChange = input => e => {
        this.setState({
            [input]: e.target.value !== "0" ? e.target.value : ""
        });
    };

    addNewTransaction = () => {
        const { transactionType, price, date, currentUID, category } = this.state;

        if (transactionType && price && date && category) {
            const transactionsRef = ref(db, `Transactions/${currentUID}`);
            const newTransaction = {
                type: transactionType,
                price: parseFloat(price),
                date: date,
                user_id: currentUID,
                category: category,
            };

            push(transactionsRef, newTransaction).then((data) => {
                this.setState(prevState => ({
                    transactions: [...prevState.transactions, { ...newTransaction, id: data.key }],
                    transactionType: '',
                    price: '',
                    date: '',
                    category: '',
                }), () => {
                    this.updateChartData();
                    this.updateSpendingChartData();
                });
            }).catch((error) => {
                console.error('Error adding transaction:', error);
            });
        } else {
            console.log('Not all conditions met');
        }
    };

    deleteTransaction = (id) => {
        const { currentUID } = this.state;
        const transactionRef = ref(db, `Transactions/${currentUID}/${id}`);

        remove(transactionRef)
            .then(() => {
                this.setState(prevState => ({
                    transactions: prevState.transactions.filter(transaction => transaction.id !== id),
                }), () => {
                    this.updateChartData();
                    this.updateSpendingChartData();
                });
            })
            .catch((error) => {
                console.error('Error deleting transaction:', error);
            });
    };

    exportData = () => {
        const { transactions } = this.state;
        const csvContent = "data:text/csv;charset=utf-8,"
            + transactions.map(t => `${t.type},${t.price},${t.date},${t.category}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
    };

    budgetPrediction = () => {
        const predictedSavings = this.state.totalIncome - this.state.totalExpenses;
        alert(`Predicted Savings for the next month: $${predictedSavings.toFixed(2)}`);
    };

    handleMonthChange = e => {
        this.setState({ selectedMonth: e.target.value }, () => {
            this.updateChartData();
            this.updateSpendingChartData();
        });
    };

    updateChartData = () => {
        const { transactions, categories, selectedMonth } = this.state;

        let totalIncome = 0;
        let totalExpenses = 0;
        let incomeData = Array(categories.income.length).fill(0);
        let expenseData = Array(categories.expenses.length).fill(0);

        transactions.forEach(transaction => {
            const transactionMonth = new Date(transaction.date).toLocaleString('default', { month: 'short' });

            if (selectedMonth === transactionMonth) {
                if (transaction.type === 'deposit') {
                    totalIncome += transaction.price;
                    incomeData[categories.income.indexOf(transaction.category)] += transaction.price;
                } else if (transaction.type === 'expense') {
                    totalExpenses += transaction.price;
                    expenseData[categories.expenses.indexOf(transaction.category)] += transaction.price;
                }
            }
        });

        this.setState({
            totalIncome,
            totalExpenses,
            remainingBalance: totalIncome - totalExpenses,
            incomeChartData: {
                labels: categories.income,
                datasets: [{ ...this.state.incomeChartData.datasets[0], data: incomeData }]
            },
            expenseChartData: {
                labels: categories.expenses,
                datasets: [{ ...this.state.expenseChartData.datasets[0], data: expenseData }]
            }
        });
    };

    updateSpendingChartData = () => {
        const { transactions, selectedMonth } = this.state;
        let chartData = {};

        transactions.forEach(transaction => {
            const transactionMonth = new Date(transaction.date).toLocaleString('default', { month: 'short' });
            if (selectedMonth === transactionMonth && transaction.type === 'expense') {
                const date = new Date(transaction.date).toLocaleDateString();
                chartData[date] = (chartData[date] || 0) + transaction.price;
            }
        });

        this.setState({
            spendingChartData: {
                labels: Object.keys(chartData),
                datasets: [{
                    ...this.state.spendingChartData.datasets[0],
                    data: Object.values(chartData)
                }]
            }
        });
    };

    handleSettingChange = (e) => {
        if (e.target.value === "profile") {
            this.setState({ showProfileUpload: true });
        } else if (e.target.value === "logout") {
            this.logout();
        }
    };

    handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profilePictures/${this.state.currentUID}`);
            uploadBytes(storageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    this.setState({ profilePictureUrl: downloadURL });
                });
            }).catch((error) => {
                console.error("Error uploading profile picture: ", error);
            });
        }
    };

    calculatePredictedExpenses = () => {
        const { transactions, categories, months } = this.state;

        // Initialize an object to store total expenses per category per month
        const expenseData = {};

        // Iterate over transactions and accumulate expenses for each category
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                const transactionMonth = new Date(transaction.date).toLocaleString('default', { month: 'short' });
                if (!expenseData[transaction.category]) {
                    expenseData[transaction.category] = {};
                }
                if (!expenseData[transaction.category][transactionMonth]) {
                    expenseData[transaction.category][transactionMonth] = 0;
                }
                expenseData[transaction.category][transactionMonth] += transaction.price;
            }
        });

        // Now calculate the average monthly expenses for each category
        const predictedExpenses = {};
        categories.expenses.forEach(category => {
            let total = 0;
            let count = 0;
            months.forEach(month => {
                if (expenseData[category] && expenseData[category][month]) {
                    total += expenseData[category][month];
                    count += 1;
                }
            });

            const averageExpense = count ? (total / count).toFixed(2) : 0;
            predictedExpenses[category] = averageExpense;
        });

        this.setState({ predictedExpenses });
    }

   

    // function to send chat input to AI API and update the chat history
    handleChatSubmit = async () => {
        const { chatInput, chatHistory } = this.state;
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

        if (chatInput.trim()) {
            const newChatHistory = [...chatHistory, { role: 'user', content: chatInput }];

            this.setState({ chatHistory: newChatHistory, chatInput: '', isChatLoading: true });

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: newChatHistory,
                    }),
                });

                const data = await response.json();
                const assistantMessage = data.choices[0].message;

                this.setState(prevState => ({
                    chatHistory: [...prevState.chatHistory, assistantMessage],
                    isChatLoading: false,
                }));
            } catch (error) {
                console.error('Error with OpenAI API:', error);
                this.setState({ isChatLoading: false });
            }
        }
    };

    // Add handle for input changes
    handleChatInputChange = (e) => {
        this.setState({ chatInput: e.target.value });
    };

    
     saveBudgetPlan = () => {
        const { targetAmount, deadline, monthlyContribution, goalName } = this.state;

        // Validate inputs
        if (!goalName || targetAmount <= 0 || monthlyContribution <= 0 || !deadline) {
            alert('Please fill out all fields with valid values.');
            return;
        }

        // Save the budget plan data to state
        this.setState({
            notifications: [...this.state.notifications, `New budget plan '${goalName}' has been saved.`],
        });

        // Optionally, send this data to a backend API or database
    };

    // Calculates months remaining until deadline
    calculateMonthsRemaining = (deadline) => {
        const currentDate = new Date();
        const deadlineDate = new Date(deadline);
        const months = (deadlineDate.getFullYear() - currentDate.getFullYear()) * 12 + (deadlineDate.getMonth() - currentDate.getMonth());
        return months > 0 ? months : 1; // Avoid division by 0
    };

    // AI Function: Calculate how much user should save each month
    calculateMonthlySavings = (targetAmount, deadline, currentBalance) => {
        const monthsRemaining = this.calculateMonthsRemaining(deadline);
        const neededMonthlySavings = (targetAmount - currentBalance) / monthsRemaining;
        return neededMonthlySavings;
    };

    // AI Function: Track savings progress
    trackProgress = (savings, targetAmount) => {
        const percentageComplete = (savings / targetAmount) * 100;
        return percentageComplete;
    };

    // AI Function: Check if user is falling behind on their savings goal
    checkIfFallingBehind = (savings, targetAmount, deadline) => {
        const monthsRemaining = this.calculateMonthsRemaining(deadline);
        const neededMonthlySavings = (targetAmount - savings) / monthsRemaining;

        if (neededMonthlySavings > this.state.monthlyContribution) {
            this.sendRealTimeNotification('You are falling behind your savings goal. Consider increasing your contributions.');
        }
    };

    // Sends real-time notifications to users
    sendRealTimeNotification = (message) => {
        this.setState({
            notifications: [...this.state.notifications, { message, timestamp: new Date() }]
        });
    };
    
    
    
    

    render() {
        const { transactions, chatInput,isChatLoading,chatHistory,  selectedMonth, months, totalIncome, totalExpenses, remainingBalance, profilePictureUrl, showProfileUpload,predictedExpenses,plaidToken,goalName, targetAmount, deadline, monthlyContribution, savingsProgress, notifications, currentSavings} = this.state;
        
        return (
         



<div className="tracker-container">
<h1 className="app-title">Financial Tracker</h1>
<h2 className="username-display">Hello, {this.props.auth}!</h2>

<Tabs>
    <TabList>
        <Tab>Overview</Tab>
        <Tab>Transactions</Tab>
        <Tab>Budget Goals</Tab>
        <Tab>AI Assistant</Tab>
        <Tab>Connect Your Bank Account</Tab>
    </TabList>

    {/* Overview Tab */}
    <TabPanel>
        <div className="overview-content">
            <div className="profile-settings">
                <select onChange={this.handleSettingChange}>
                    <option value="0">Settings</option>
                    <option value="logout">Logout</option>
                </select>
                
            </div>

            <h3>Tracker</h3>
            <h4>Total Income: ${totalIncome.toFixed(2)}</h4>
            <h4>Total Expenses: ${totalExpenses.toFixed(2)}</h4>
            <h4>Remaining Balance: ${remainingBalance.toFixed(2)}</h4>

            <div className="chart-container">
                <div className="chart">
                    <h3>Income</h3>
                    <Pie data={this.state.incomeChartData} />
                </div>

                <div className="chart">
                    <h3>Expenses</h3>
                    <Pie data={this.state.expenseChartData} />
                </div>
            </div>

            <div className="chart">
                <h3>Monthly Spending</h3>
                <Line data={this.state.spendingChartData} />
            </div>

            {/* Predicted Expenses Section */}
            <div className="predicted-expenses">
                <h4>Predicted Expenses for Next Month:</h4>
                <ul>
                    {Object.keys(predictedExpenses).map(category => (
                        <li key={category}>
                            {category}: ${predictedExpenses[category]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </TabPanel>

    {/* Transactions Tab */}
    <TabPanel>
        <h3>Transaction History</h3>
        <div className="form">
            {/* Transaction Input Form */}
            <label>Type:</label>
            <select value={this.state.transactionType} onChange={this.handleChange('transactionType')}>
                <option value="0">Select Type</option>
                <option value="deposit">Income</option>
                <option value="expense">Expense</option>
            </select>

            <label>Category:</label>
            <select value={this.state.category} onChange={this.handleChange('category')}>
                <option value="0">Select Category</option>
                {(this.state.transactionType === 'deposit' ? this.state.categories.income : this.state.categories.expenses).map(category =>
                    <option key={category} value={category}>{category}</option>
                )}
            </select>

            <label>Amount:</label>
            <input type="number" value={this.state.price} onChange={this.handleChange('price')} />

            <label>Date:</label>
            <input type="date" value={this.state.date} onChange={this.handleChange('date')} />

            <button onClick={this.addNewTransaction}>Add Transaction</button>
        </div>

        <select value={selectedMonth} onChange={this.handleMonthChange}>
            {months.map(month => (
                <option key={month} value={month}>{month}</option>
            ))}
        </select>

        <div className="transaction-list">
            {transactions
                .filter(transaction => new Date(transaction.date).toLocaleString('default', { month: 'short' }) === selectedMonth)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                        <div className="transaction-info">
                            <p>{new Date(transaction.date).toLocaleDateString()}</p>
                            <p>{transaction.category}</p>
                        </div>
                        <div className="transaction-details">
                            <p>{transaction.type === 'deposit' ? `+ $${transaction.price.toFixed(2)}` : `- $${transaction.price.toFixed(2)}`}</p>
                            <button onClick={() => this.deleteTransaction(transaction.id)}>Delete</button>
                        </div>
                    </div>
                ))}
        </div>

        <button onClick={this.clearBudget}>Clear All Transactions</button>
        <button onClick={this.exportData}>Export Data</button>
        <button onClick={this.budgetPrediction}>Predict Budget</button>
    </TabPanel>

    {/* Budget Goals Tab */}
    <TabPanel>
        <div className="budget-customization">
            <h3>Customize Your Budget Plan</h3>
            <label>Goal Name:</label>
            <input type="text" value={goalName} onChange={this.handleChange('goalName')} />

            <label>Target Amount:</label>
            <input type="number" value={targetAmount} onChange={this.handleChange('targetAmount')} />

            <label>Deadline:</label>
            <input type="date" value={deadline} onChange={this.handleChange('deadline')} />

            <label>Monthly Contribution:</label>
            <input type="number" value={monthlyContribution} onChange={this.handleChange('monthlyContribution')} />

            <button onClick={this.saveBudgetPlan}>Save Budget Plan</button>

            {/* Display savings progress */}
            <div className="progress-section">
                <h3>{goalName} Progress</h3>
                <progress value={this.trackProgress(remainingBalance, targetAmount)} max="100"></progress>
                <p>{this.trackProgress(remainingBalance, targetAmount).toFixed(2)}% complete</p>
            </div>
        </div>
    </TabPanel>

    {/* AI Assistant Tab */}
    <TabPanel>
        <div className="chatbot-section">
            <h3>AI Financial Assistant</h3>

            {/* Chat history */}
            <div className="chat-history">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat-message ${chat.sender}`}>
                        <p>{chat.message}</p>
                    </div>
                ))}
            </div>

            {/* Chat input */}
            <input
                type="text"
                placeholder="Ask me a financial question..."
                value={chatInput}
                onChange={this.handleChatInputChange}
                disabled={isChatLoading}
            />
            <button onClick={this.handleChatSubmit} disabled={isChatLoading}>
                {isChatLoading ? 'Loading...' : 'Send'}
            </button>
        </div>
    </TabPanel>

    {/* Connect Your Bank Account Tab */}
    <TabPanel>
        <h1>Connect Your Bank Account</h1>
        <PlaidLink
            publicKey="66e2546d5021c6001a1fccf6"
            env="sandbox"
            product={['transactions']}
            onSuccess={this.handlePlaidSuccess}
            onExit={this.handlePlaidError}
            style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                display: "block",
                margin: "20px auto",
            }}
        >
            Connect to Banks
        </PlaidLink>

        {/* Optionally display fetched transactions */}
        {this.state.transactions.length > 0 && (
            <div>
                <h2>Fetched Transactions:</h2>
                <ul>
                    {this.state.transactions.map((transaction) => (
                        <li key={transaction.id}>
                            {transaction.date} - {transaction.category}: ${transaction.price}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Notifications */}
        <div className="notifications-section">
            <h4>Notifications:</h4>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        {notification.message} - {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : 'N/A'}
                    </li>
                ))}
            </ul>
        </div>
    </TabPanel>
</Tabs>
</div>
            
        );
    }

    
}

export default Tracker;


