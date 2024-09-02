

// import React, { Component } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import { auth, db, storage } from '../Config/Fire';
// import { ref, onValue, push, remove, update } from 'firebase/database';
// import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';
// import Transaction from './Transaction/Transaction';
// import './Tracker.css';

// Chart.register(...registerables);

// class Tracker extends Component {
//     state = {
//         transactions: [],
//         money: 0,
//         transactionType: '',
//         price: '',
//         date: '',
//         currentUID: auth.currentUser?.uid || '',
//         category: '',
//         totalIncome: 0,
//         totalExpenses: 0,
//         remainingBalance: 0,
//         monthlyData: {},
//         profilePictureUrl: '',
//         categories: {
//             income: ['Salary', 'Bonuses', 'Investment', 'Other'],
//             expenses: ['Food', 'Transportation', 'Rent', 'Other']
//         },
//         incomeChartData: {
//             labels: [],
//             datasets: [
//                 {
//                     label: 'Income',
//                     data: [],
//                     backgroundColor: [
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(255, 206, 86, 0.2)',
//                         'rgba(153, 102, 255, 0.2)',
//                     ],
//                     borderColor: [
//                         'rgba(75, 192, 192, 1)',
//                         'rgba(54, 162, 235, 1)',
//                         'rgba(255, 206, 86, 1)',
//                         'rgba(153, 102, 255, 1)',
//                     ],
//                     borderWidth: 1,
//                 },
//             ],
//         },
//         expenseChartData: {
//             labels: [],
//             datasets: [
//                 {
//                     label: 'Expenses',
//                     data: [],
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)',
//                         'rgba(255, 159, 64, 0.2)',
//                         'rgba(255, 205, 86, 0.2)',
//                         'rgba(75, 192, 192, 0.2)',
//                     ],
//                     borderColor: [
//                         'rgba(255, 99, 132, 1)',
//                         'rgba(255, 159, 64, 1)',
//                         'rgba(255, 205, 86, 1)',
//                         'rgba(75, 192, 192, 1)',
//                     ],
//                     borderWidth: 1,
//                 },
//             ],
//         },
//     };

//     clearBudget = () => {
//         const confirmClear = window.confirm("Are you sure you want to clear all transactions?");
//         if (confirmClear) {
//             const { currentUID } = this.state;
//             const transactionsRef = ref(db, `Transactions/${currentUID}`);

//             remove(transactionsRef)
//                 .then(() => {
//                     this.setState({
//                         transactions: [],
//                         money: 0,
//                         totalIncome: 0,
//                         totalExpenses: 0,
//                         remainingBalance: 0,
//                         incomeChartData: { ...this.state.incomeChartData, labels: [], datasets: [{ ...this.state.incomeChartData.datasets[0], data: [] }] },
//                         expenseChartData: { ...this.state.expenseChartData, labels: [], datasets: [{ ...this.state.expenseChartData.datasets[0], data: [] }] },
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Error clearing transactions: ", error);
//                 });
//         }
//     };

//     logout = () => {
//         auth.signOut();
//     };

//     handleChange = input => e => {
//         this.setState({
//             [input]: e.target.value !== "0" ? e.target.value : ""
//         });
//     };

//     addNewTransaction = () => {
//         const { transactionType, price, date, currentUID, category } = this.state;

//         if (transactionType && price && date && category) {
//             const transactionsRef = ref(db, `Transactions/${currentUID}`);
//             const newTransaction = {
//                 type: transactionType,
//                 price: parseFloat(price),
//                 date: date,
//                 user_id: currentUID,
//                 category: category,
//             };

//             push(transactionsRef, newTransaction).then((data) => {
//                 console.log('Transaction added successfully:', data.key); // Debugging
//                 this.setState(prevState => ({
//                     transactions: [...prevState.transactions, { ...newTransaction, id: data.key }],
//                     transactionType: '',
//                     price: '',
//                     date: '',
//                     category: '',
//                 }), this.updateChartData);
//             }).catch((error) => {
//                 console.error('Error adding transaction:', error); // Debugging
//             });
//         } else {
//             console.log('Not all conditions met'); // Debugging
//         }
//     };

//     componentDidMount() {
//         const { currentUID } = this.state;
//         const transactionsRef = ref(db, `Transactions/${currentUID}`);

//         onValue(transactionsRef, (snapshot) => {
//             let transactions = [];

//             snapshot.forEach((childSnapshot) => {
//                 transactions.push({ ...childSnapshot.val(), id: childSnapshot.key });
//             });

//             this.setState({ transactions }, this.updateChartData);
//         });

//         const userRef = ref(db, `Users/${currentUID}`);
//         onValue(userRef, (snapshot) => {
//             const data = snapshot.val();
//             if (data && data.profilePictureUrl) {
//                 this.setState({ profilePictureUrl: data.profilePictureUrl });
//             }
//         });
//     }

//     updateChartData = () => {
//         const { transactions, categories } = this.state;

//         let totalIncome = 0;
//         let totalExpenses = 0;
//         let monthlyData = {};
//         let incomeData = Array(categories.income.length).fill(0);
//         let expenseData = Array(categories.expenses.length).fill(0);

//         transactions.forEach(transaction => {
//             const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
//             if (!monthlyData[month]) {
//                 monthlyData[month] = { income: 0, expenses: 0 };
//             }

//             if (transaction.type === 'deposit') {
//                 totalIncome += transaction.price;
//                 monthlyData[month].income += transaction.price;
//                 incomeData[categories.income.indexOf(transaction.category)] += transaction.price;
//             } else if (transaction.type === 'expense') {
//                 totalExpenses += transaction.price;
//                 monthlyData[month].expenses += transaction.price;
//                 expenseData[categories.expenses.indexOf(transaction.category)] += transaction.price;
//             }
//         });

//         this.setState({
//             totalIncome,
//             totalExpenses,
//             remainingBalance: totalIncome - totalExpenses,
//             monthlyData,
//             incomeChartData: {
//                 labels: categories.income,
//                 datasets: [{ ...this.state.incomeChartData.datasets[0], data: incomeData }]
//             },
//             expenseChartData: {
//                 labels: categories.expenses,
//                 datasets: [{ ...this.state.expenseChartData.datasets[0], data: expenseData }]
//             },
//         });
//     };

//     handleProfilePictureUpload = (e) => {
//         const file = e.target.files[0];
//         const profilePictureRef = storageRef(storage, `profilePictures/${this.state.currentUID}`);

//         const uploadTask = uploadBytesResumable(profilePictureRef, file);

//         uploadTask.on(
//             'state_changed',
//             (snapshot) => {
//                 // Handle progress, pause, and resume states
//             },
//             (error) => {
//                 console.error('Upload failed:', error); // Debugging
//             },
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//                     console.log('Profile picture URL:', url); // Debugging
//                     this.setState({ profilePictureUrl: url });
//                     const userRef = ref(db, `Users/${this.state.currentUID}`);
//                     update(userRef, { profilePictureUrl: url }).then(() => {
//                         console.log('Profile picture URL updated in Firebase'); // Debugging
//                     }).catch((error) => {
//                         console.error('Error updating profile picture URL in Firebase:', error); // Debugging
//                     });
//                 });
//             }
//         );
//     };

//     render() {
//         const currentUser = auth.currentUser;

//         return (
//             <div className="trackerBlock">
//                 <div className="welcome">
//                     <img src={this.state.profilePictureUrl || 'default-profile.png'} alt="Profile" className="profilePicture" />
//                     <span>Hi, {currentUser.displayName}!</span>
//                     <input type="file" onChange={this.handleProfilePictureUpload} />
//                     <button className="exit" onClick={this.logout}>Sign Out</button>
//                 </div>
//                 <h1>Budget Tracker</h1>
//                 <div className="summary">
//                     <div className="totalIncome">Total Income: ${this.state.totalIncome.toFixed(2)}</div>
//                     <div className="totalExpenses">Total Expenses: ${this.state.totalExpenses.toFixed(2)}</div>
//                     <div className="remainingBalance">Remaining Balance: ${this.state.remainingBalance.toFixed(2)}</div>
//                 </div>

//                 <div className="charts">
//                     <div className="chartBlock">
//                         <h2>Income</h2>
//                         <Pie data={this.state.incomeChartData} />
//                     </div>
//                     <div className="chartBlock">
//                         <h2>Expenses</h2>
//                         <Pie data={this.state.expenseChartData} />
//                     </div>
//                 </div>

//                 <div className="latestTransactions">
//                     <p>Latest Transactions</p>
//                     <ul>
//                         {this.state.transactions.map((transaction) => (
//                             <Transaction
//                                 key={transaction.id}
//                                 type={transaction.type}
//                                 price={transaction.price}
//                                 date={transaction.date}
//                                 category={transaction.category}
//                             />
//                         ))}
//                     </ul>
//                 </div>

//                 <button className="clear" onClick={this.clearBudget}>Clear Budget</button>
//                 <div className="addTransaction">
//                     <h2>Add Transaction</h2>
//                     <input type="text" placeholder="Type (deposit/expense)" value={this.state.transactionType} onChange={this.handleChange('transactionType')} />
//                     <input type="number" placeholder="Amount" value={this.state.price} onChange={this.handleChange('price')} />
//                     <input type="date" value={this.state.date} onChange={this.handleChange('date')} />
//                     <select value={this.state.category} onChange={this.handleChange('category')}>
//                         <option value="">Select Category</option>
//                         {this.state.categories.income.map(category => (
//                             <option key={category} value={category}>{category}</option>
//                         ))}
//                         {this.state.categories.expenses.map(category => (
//                             <option key={category} value={category}>{category}</option>
//                         ))}
//                     </select>
//                     <button onClick={this.addNewTransaction}>Add Transaction</button>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Tracker;


// import React, { Component } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import { auth, db, storage } from '../Config/Fire';
// import { ref, onValue, push, remove, update, query, orderByChild } from 'firebase/database';
// import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';
// import Transaction from './Transaction/Transaction';
// import './Tracker.css';

// Chart.register(...registerables);

// class Tracker extends Component {
//     state = {
//         transactions: [],
//         money: 0,
//         transactionType: '',
//         price: '',
//         date: '',
//         currentUID: auth.currentUser?.uid || '',
//         category: '',
//         selectedMonth: new Date().toLocaleString('default', { month: 'short' }),
//         totalIncome: 0,
//         totalExpenses: 0,
//         remainingBalance: 0,
//         monthlyData: {},
//         incomeChartData: {
//             labels: [],
//             datasets: [
//                 {
//                     label: 'Income',
//                     data: [],
//                     backgroundColor: [
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(255, 206, 86, 0.2)',
//                         'rgba(153, 102, 255, 0.2)',
//                     ],
//                     borderColor: [
//                         'rgba(75, 192, 192, 1)',
//                         'rgba(54, 162, 235, 1)',
//                         'rgba(255, 206, 86, 1)',
//                         'rgba(153, 102, 255, 1)',
//                     ],
//                     borderWidth: 1,
//                 },
//             ],
//         },
//         expenseChartData: {
//             labels: [],
//             datasets: [
//                 {
//                     label: 'Expenses',
//                     data: [],
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)',
//                         'rgba(255, 159, 64, 0.2)',
//                         'rgba(255, 205, 86, 0.2)',
//                         'rgba(75, 192, 192, 0.2)',
//                     ],
//                     borderColor: [
//                         'rgba(255, 99, 132, 1)',
//                         'rgba(255, 159, 64, 1)',
//                         'rgba(255, 205, 86, 1)',
//                         'rgba(75, 192, 192, 1)',
//                     ],
//                     borderWidth: 1,
//                 },
//             ],
//         },
//         profilePictureUrl: '',
//         categories: {
//             income: ['Salary', 'Bonus', 'Interest'],
//             expenses: ['Rent', 'Groceries', 'Utilities'],
//         },
//     };

//     componentDidMount() {
//         const { currentUID } = this.state;

//         if (currentUID) {
//             const transactionsRef = ref(db, `Transactions/${currentUID}`);
//             onValue(transactionsRef, (snapshot) => {
//                 const transactions = snapshot.val() || {};
//                 const transactionsArray = Object.keys(transactions).map(key => ({ ...transactions[key], id: key }));
//                 this.setState({ transactions: transactionsArray }, this.updateChartData);
//             });
//         }
//     }

//     clearBudget = () => {
//         const confirmClear = window.confirm("Are you sure you want to clear all transactions?");
//         if (confirmClear) {
//             const { currentUID } = this.state;
//             const transactionsRef = ref(db, `Transactions/${currentUID}`);

//             remove(transactionsRef)
//                 .then(() => {
//                     this.setState({
//                         transactions: [],
//                         money: 0,
//                         totalIncome: 0,
//                         totalExpenses: 0,
//                         remainingBalance: 0,
//                         incomeChartData: { ...this.state.incomeChartData, labels: [], datasets: [{ ...this.state.incomeChartData.datasets[0], data: [] }] },
//                         expenseChartData: { ...this.state.expenseChartData, labels: [], datasets: [{ ...this.state.expenseChartData.datasets[0], data: [] }] },
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Error clearing transactions: ", error);
//                 });
//         }
//     };

//     logout = () => {
//         auth.signOut();
//     };

//     handleChange = input => e => {
//         this.setState({
//             [input]: e.target.value !== "0" ? e.target.value : ""
//         });
//     };

//     addNewTransaction = () => {
//         const { transactionType, price, date, currentUID, category } = this.state;

//         if (transactionType && price && date && category) {
//             const transactionsRef = ref(db, `Transactions/${currentUID}`);
//             const newTransaction = {
//                 type: transactionType,
//                 price: parseFloat(price),
//                 date: date,
//                 user_id: currentUID,
//                 category: category,
//             };

//             push(transactionsRef, newTransaction).then((data) => {
//                 this.setState(prevState => ({
//                     transactions: [...prevState.transactions, { ...newTransaction, id: data.key }],
//                     transactionType: '',
//                     price: '',
//                     date: '',
//                     category: '',
//                 }), this.updateChartData);
//             }).catch((error) => {
//                 console.error('Error adding transaction:', error);
//             });
//         } else {
//             console.log('Not all conditions met');
//         }
//     };

//     deleteTransaction = (id) => {
//         const { currentUID } = this.state;
//         const transactionRef = ref(db, `Transactions/${currentUID}/${id}`);

//         remove(transactionRef)
//             .then(() => {
//                 this.setState(prevState => ({
//                     transactions: prevState.transactions.filter(transaction => transaction.id !== id),
//                 }), this.updateChartData);
//             })
//             .catch((error) => {
//                 console.error('Error deleting transaction:', error);
//             });
//     };

//     exportData = () => {
//         const { transactions } = this.state;
//         const csvContent = "data:text/csv;charset=utf-8,"
//             + transactions.map(t => `${t.type},${t.price},${t.date},${t.category}`).join("\n");

//         const encodedUri = encodeURI(csvContent);
//         const link = document.createElement("a");
//         link.setAttribute("href", encodedUri);
//         link.setAttribute("download", "transactions.csv");
//         document.body.appendChild(link);
//         link.click();
//     };

//     budgetPrediction = () => {
//         const predictedSavings = this.state.totalIncome - this.state.totalExpenses;
//         alert(`Predicted Savings for the next month: $${predictedSavings.toFixed(2)}`);
//     };

//     handleMonthChange = e => {
//         this.setState({ selectedMonth: e.target.value }, this.updateChartData);
//     };

//     updateChartData = () => {
//         const { transactions, categories, selectedMonth } = this.state;

//         let totalIncome = 0;
//         let totalExpenses = 0;
//         let monthlyData = {};
//         let incomeData = Array(categories.income.length).fill(0);
//         let expenseData = Array(categories.expenses.length).fill(0);

//         transactions.forEach(transaction => {
//             const transactionMonth = new Date(transaction.date).toLocaleString('default', { month: 'short' });

//             if (selectedMonth === transactionMonth) {
//                 if (!monthlyData[transactionMonth]) {
//                     monthlyData[transactionMonth] = { income: 0, expenses: 0 };
//                 }

//                 if (transaction.type === 'deposit') {
//                     totalIncome += transaction.price;
//                     monthlyData[transactionMonth].income += transaction.price;
//                     incomeData[categories.income.indexOf(transaction.category)] += transaction.price;
//                 } else if (transaction.type === 'expense') {
//                     totalExpenses += transaction.price;
//                     monthlyData[transactionMonth].expenses += transaction.price;
//                     expenseData[categories.expenses.indexOf(transaction.category)] += transaction.price;
//                 }
//             }
//         });

//         this.setState({
//             totalIncome,
//             totalExpenses,
//             remainingBalance: totalIncome - totalExpenses,
//             monthlyData,
//             incomeChartData: {
//                 labels: categories.income,
//                 datasets: [{ ...this.state.incomeChartData.datasets[0], data: incomeData }]
//             },
//             expenseChartData: {
//                 labels: categories.expenses,
//                 datasets: [{ ...this.state.expenseChartData.datasets[0], data: expenseData }]
//             },
//         });
//     };

//     handleProfilePictureUpload = (e) => {
//         const file = e.target.files[0];
//         const profilePictureRef = storageRef(storage, `profilePictures/${this.state.currentUID}`);

//         const uploadTask = uploadBytesResumable(profilePictureRef, file);

//         uploadTask.on(
//             'state_changed',
//             (snapshot) => {
//                 // Handle progress, pause, and resume states
//             },
//             (error) => {
//                 console.error('Upload failed:', error);
//             },
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//                     this.setState({ profilePictureUrl: url });
//                     const userRef = ref(db, `Users/${this.state.currentUID}`);
//                     update(userRef, { profilePictureUrl: url });
//                 });
//             }
//         );
//     };

//     render() {
//         const { currentUID, profilePictureUrl, selectedMonth, incomeChartData, expenseChartData, transactions } = this.state;
//         const currentUser = auth.currentUser;

//         return (
//             <div className="tracker">
//                 {currentUser ? (
//                     <div className="header">
//                         <img src={profilePictureUrl || 'default-profile.png'} alt="Profile" />
//                         <span>Hi, {currentUser.displayName}!</span>
//                         <input type="file" onChange={this.handleProfilePictureUpload} />
//                         <button className="exit" onClick={this.logout}>Sign Out</button>
//                     </div>
//                 ) : (
//                     <div className="header">
//                         <span>Hi, Guest!</span>
//                         <button className="exit" onClick={this.logout}>Sign Out</button>
//                     </div>
//                 )}
//                 <h1>Budget Tracker</h1>
//                 <div className="summary">
//                     <div className="totalIncome">Total Income: ${this.state.totalIncome.toFixed(2)}</div>
//                     <div className="totalExpenses">Total Expenses: ${this.state.totalExpenses.toFixed(2)}</div>
//                     <div className="remainingBalance">Remaining Balance: ${this.state.remainingBalance.toFixed(2)}</div>
//                 </div>

//                 <div className="monthSelector">
//                     <label htmlFor="month">Select Month:</label>
//                     <select id="month" value={selectedMonth} onChange={this.handleMonthChange}>
//                         {Array.from({ length: 12 }, (_, i) => {
//                             const month = new Date(0, i).toLocaleString('default', { month: 'short' });
//                             return <option key={month} value={month}>{month}</option>;
//                         })}
//                     </select>
//                 </div>

//                 <div className="charts">
//                     <div className="chartBlock">
//                         <h2>Income</h2>
//                         <Pie data={incomeChartData} />
//                     </div>
//                     <div className="chartBlock">
//                         <h2>Expenses</h2>
//                         <Pie data={expenseChartData} />
//                     </div>
//                 </div>

//                 <div className="latestTransactions">
//                     <p>Latest Transactions</p>
//                     <ul>
//                         {transactions.map((transaction) => (
//                             <li key={transaction.id}>
//                                 <Transaction
//                                     type={transaction.type}
//                                     price={transaction.price}
//                                     date={transaction.date}
//                                     category={transaction.category}
//                                 />
//                                 <button onClick={() => this.deleteTransaction(transaction.id)}>Delete</button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 <button className="clear" onClick={this.clearBudget}>Clear Budget</button>
//                 <button className="export" onClick={this.exportData}>Export Data</button>
//                 <button className="predict" onClick={this.budgetPrediction}>Budget Prediction</button>

//                 <div className="addTransaction">
//                     <h2>Add Transaction</h2>
//                     <input type="text" placeholder="Type (deposit/expense)" value={this.state.transactionType} onChange={this.handleChange('transactionType')} />
//                     <input type="number" placeholder="Amount" value={this.state.price} onChange={this.handleChange('price')} />
//                     <input type="date" value={this.state.date} onChange={this.handleChange('date')} />
//                     <select value={this.state.category} onChange={this.handleChange('category')}>
//                         <option value="">Select Category</option>
//                         {this.state.categories.income.map(category => (
//                             <option key={category} value={category}>{category}</option>
//                         ))}
//                         {this.state.categories.expenses.map(category => (
//                             <option key={category} value={category}>{category}</option>
//                         ))}
//                     </select>
//                     <button onClick={this.addNewTransaction}>Add Transaction</button>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Tracker;

// import React, { Component } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import { auth, db } from '../Config/Fire';
// import { ref, onValue, push, remove } from 'firebase/database';
// import Transaction from './Transaction/Transaction';
// import './Tracker.css';

// Chart.register(...registerables);

// class Tracker extends Component {
//     state = {
//         transactions: [],
//         money: 0,
//         transactionType: '',
//         price: '',
//         date: '',
//         currentUID: auth.currentUser?.uid || '',
//         category: '',
//         selectedMonth: new Date().toLocaleString('default', { month: 'short' }),
//         totalIncome: 0,
//         totalExpenses: 0,
//         remainingBalance: 0,
//         incomeChartData: {
//             labels: [],
//             datasets: [
//                 {
//                     label: 'Income',
//                     data: [],
//                     backgroundColor: [
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(255, 206, 86, 0.2)',
//                         'rgba(153, 102, 255, 0.2)',
//                     ],
//                     borderColor: [
//                         'rgba(75, 192, 192, 1)',
//                         'rgba(54, 162, 235, 1)',
//                         'rgba(255, 206, 86, 1)',
//                         'rgba(153, 102, 255, 1)',
//                     ],
//                     borderWidth: 1,
//                 },
//             ],
//         },
//         expenseChartData: {
//             labels: [],
//             datasets: [
//                 {
//                     label: 'Expenses',
//                     data: [],
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)',
//                         'rgba(255, 159, 64, 0.2)',
//                         'rgba(255, 205, 86, 0.2)',
//                         'rgba(75, 192, 192, 0.2)',
//                     ],
//                     borderColor: [
//                         'rgba(255, 99, 132, 1)',
//                         'rgba(255, 159, 64, 1)',
//                         'rgba(255, 205, 86, 1)',
//                         'rgba(75, 192, 192, 1)',
//                     ],
//                     borderWidth: 1,
//                 },
//             ],
//         },
//         profilePictureUrl: '',
//         categories: {
//             income: ['Salary', 'Bonus', 'Interest'],
//             expenses: ['Rent', 'Groceries', 'Utilities'],
//         },
//         months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     };

//     componentDidMount() {
//         const { currentUID } = this.state;

//         if (currentUID) {
//             const transactionsRef = ref(db, `Transactions/${currentUID}`);
//             onValue(transactionsRef, (snapshot) => {
//                 const transactions = snapshot.val() || {};
//                 const transactionsArray = Object.keys(transactions).map(key => ({ ...transactions[key], id: key }));
//                 this.setState({ transactions: transactionsArray }, this.updateChartData);
//             });
//         }
//     }

//     clearBudget = () => {
//         const confirmClear = window.confirm("Are you sure you want to clear all transactions?");
//         if (confirmClear) {
//             const { currentUID } = this.state;
//             const transactionsRef = ref(db, `Transactions/${currentUID}`);

//             remove(transactionsRef)
//                 .then(() => {
//                     this.setState({
//                         transactions: [],
//                         money: 0,
//                         totalIncome: 0,
//                         totalExpenses: 0,
//                         remainingBalance: 0,
//                         incomeChartData: { ...this.state.incomeChartData, labels: [], datasets: [{ ...this.state.incomeChartData.datasets[0], data: [] }] },
//                         expenseChartData: { ...this.state.expenseChartData, labels: [], datasets: [{ ...this.state.expenseChartData.datasets[0], data: [] }] },
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Error clearing transactions: ", error);
//                 });
//         }
//     };

//     logout = () => {
//         auth.signOut();
//     };

//     handleChange = input => e => {
//         this.setState({
//             [input]: e.target.value !== "0" ? e.target.value : ""
//         });
//     };

//     addNewTransaction = () => {
//         const { transactionType, price, date, currentUID, category } = this.state;

//         if (transactionType && price && date && category) {
//             const transactionsRef = ref(db, `Transactions/${currentUID}`);
//             const newTransaction = {
//                 type: transactionType,
//                 price: parseFloat(price),
//                 date: date,
//                 user_id: currentUID,
//                 category: category,
//             };

//             push(transactionsRef, newTransaction).then((data) => {
//                 this.setState(prevState => ({
//                     transactions: [...prevState.transactions, { ...newTransaction, id: data.key }],
//                     transactionType: '',
//                     price: '',
//                     date: '',
//                     category: '',
//                 }), this.updateChartData);
//             }).catch((error) => {
//                 console.error('Error adding transaction:', error);
//             });
//         } else {
//             console.log('Not all conditions met');
//         }
//     };

//     deleteTransaction = (id) => {
//         const { currentUID } = this.state;
//         const transactionRef = ref(db, `Transactions/${currentUID}/${id}`);

//         remove(transactionRef)
//             .then(() => {
//                 this.setState(prevState => ({
//                     transactions: prevState.transactions.filter(transaction => transaction.id !== id),
//                 }), this.updateChartData);
//             })
//             .catch((error) => {
//                 console.error('Error deleting transaction:', error);
//             });
//     };

//     exportData = () => {
//         const { transactions } = this.state;
//         const csvContent = "data:text/csv;charset=utf-8,"
//             + transactions.map(t => `${t.type},${t.price},${t.date},${t.category}`).join("\n");

//         const encodedUri = encodeURI(csvContent);
//         const link = document.createElement("a");
//         link.setAttribute("href", encodedUri);
//         link.setAttribute("download", "transactions.csv");
//         document.body.appendChild(link);
//         link.click();
//     };

//     budgetPrediction = () => {
//         const predictedSavings = this.state.totalIncome - this.state.totalExpenses;
//         alert(`Predicted Savings for the next month: $${predictedSavings.toFixed(2)}`);
//     };

//     handleMonthChange = e => {
//         this.setState({ selectedMonth: e.target.value }, this.updateChartData);
//     };

//     updateChartData = () => {
//         const { transactions, categories, selectedMonth } = this.state;

//         let totalIncome = 0;
//         let totalExpenses = 0;
//         let incomeData = Array(categories.income.length).fill(0);
//         let expenseData = Array(categories.expenses.length).fill(0);

//         transactions.forEach(transaction => {
//             const transactionMonth = new Date(transaction.date).toLocaleString('default', { month: 'short' });

//             if (selectedMonth === transactionMonth) {
//                 if (transaction.type === 'deposit') {
//                     totalIncome += transaction.price;
//                     incomeData[categories.income.indexOf(transaction.category)] += transaction.price;
//                 } else if (transaction.type === 'expense') {
//                     totalExpenses += transaction.price;
//                     expenseData[categories.expenses.indexOf(transaction.category)] += transaction.price;
//                 }
//             }
//         });

//         this.setState({
//             totalIncome,
//             totalExpenses,
//             remainingBalance: totalIncome - totalExpenses,
//             incomeChartData: {
//                 labels: categories.income,
//                 datasets: [{ ...this.state.incomeChartData.datasets[0], data: incomeData }]
//             },
//             expenseChartData: {
//                 labels: categories.expenses,
//                 datasets: [{ ...this.state.expenseChartData.datasets[0], data: expenseData }]
//             }
//         });
//     };

//     render() {
//         const { transactionType, price, date, transactions, totalIncome, totalExpenses, remainingBalance, incomeChartData, expenseChartData, profilePictureUrl, months, selectedMonth } = this.state;

//         return (
//             <div className="tracker-container">
//                 <header className="tracker-header">
//                     <div className="profile-section">
//                         <img className="profile-picture" src={profilePictureUrl} alt="Profile" />
//                         <div className="profile-actions">
//                             <button onClick={this.logout}>Logout</button>
//                             <button onClick={this.clearBudget}>Clear All Transactions</button>
//                             <button onClick={this.budgetPrediction}>Budget Prediction</button>
//                             <button onClick={this.exportData}>Export Data</button>
//                         </div>
//                     </div>
//                     <div className="summary-section">
//                         <div className="summary-item">
//                             <h2>Total Income</h2>
//                             <p>${totalIncome.toFixed(2)}</p>
//                         </div>
//                         <div className="summary-item">
//                             <h2>Total Expenses</h2>
//                             <p>${totalExpenses.toFixed(2)}</p>
//                         </div>
//                         <div className="summary-item">
//                             <h2>Remaining Balance</h2>
//                             <p>${remainingBalance.toFixed(2)}</p>
//                         </div>
//                     </div>
//                 </header>

//                 <div className="charts-container">
//                     <div className="chart">
//                         <h3>Income Distribution</h3>
//                         <Pie data={incomeChartData} />
//                     </div>
//                     <div className="chart">
//                         <h3>Expenses Distribution</h3>
//                         <Pie data={expenseChartData} />
//                     </div>
//                 </div>

//                 <div className="transactions-section">
//                     <h3>Add Transaction</h3>
//                     <select onChange={this.handleChange('transactionType')} value={transactionType}>
//                         <option value="0">Select Type</option>
//                         <option value="deposit">Deposit</option>
//                         <option value="expense">Expense</option>
//                     </select>

//                     <select onChange={this.handleChange('category')} value={this.state.category}>
//                         <option value="0">Select Category</option>
//                         {this.state.transactionType === 'deposit' ? 
//                             this.state.categories.income.map(cat => <option key={cat} value={cat}>{cat}</option>)
//                             : this.state.categories.expenses.map(cat => <option key={cat} value={cat}>{cat}</option>)
//                         }
//                     </select>

//                     <input type="text" placeholder="Price" onChange={this.handleChange('price')} value={price} />
//                     <input type="date" onChange={this.handleChange('date')} value={date} />
//                     <button onClick={this.addNewTransaction}>Add Transaction</button>

//                     <h3>View by Month</h3>
//                     <select onChange={this.handleMonthChange} value={selectedMonth}>
//                         {months.map(month => <option key={month} value={month}>{month}</option>)}
//                     </select>

//                     <h3>Transaction History</h3>
//                     <div className="transaction-list">
//                         {transactions
//                             .filter(transaction => new Date(transaction.date).toLocaleString('default', { month: 'short' }) === selectedMonth)
//                             .sort((a, b) => new Date(b.date) - new Date(a.date))
//                             .map(transaction => (
//                                 <Transaction key={transaction.id} transaction={transaction} deleteTransaction={this.deleteTransaction} />
//                             ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Tracker;


import React, { Component } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { auth, db, storage } from '../Config/Fire';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import Transaction from './Transaction/Transaction';
import './Tracker.css';

Chart.register(...registerables);

class Tracker extends Component {
    state = {
        transactions: [],
        money: 0,
        transactionType: '',
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
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)',
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
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
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
        showProfileUpload: false,
        categories: {
            income: ['Salary', 'Bonus', 'Interest'],
            expenses: ['Rent', 'Groceries', 'Utilities'],
        },
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
                });
            });
        }
    }

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

    render() {
        const { transactions, money, selectedMonth, months, totalIncome, totalExpenses, remainingBalance, profilePictureUrl, showProfileUpload } = this.state;

        return (
            <div className="tracker-container">
                <div className="profile-settings">
                    <img className="profile-picture" src={profilePictureUrl || "default-profile.png"} alt="Profile" />
                    <select onChange={this.handleSettingChange}>
                        <option value="0">Settings</option>
                        <option value="profile">Update Profile Picture</option>
                        <option value="logout">Logout</option>
                    </select>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={this.handleProfilePictureChange}
                        style={{ display: showProfileUpload ? 'block' : 'none' }}
                    />
                </div>

                <h3>Tracker</h3>
                <h4>Total Income: ${totalIncome.toFixed(2)}</h4>
                <h4>Total Expenses: ${totalExpenses.toFixed(2)}</h4>
                <h4>Remaining Balance: ${remainingBalance.toFixed(2)}</h4>

                <div className="form">
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

                <h3>Transaction History</h3>
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

                <div className="chart">
                    <h3>Income</h3>
                    <Pie data={this.state.incomeChartData} />
                </div>

                <div className="chart">
                    <h3>Expenses</h3>
                    <Pie data={this.state.expenseChartData} />
                </div>

                <div className="chart">
                    <h3>Monthly Spending</h3>
                    <Line data={this.state.spendingChartData} />
                </div>

                <button onClick={this.clearBudget}>Clear All Transactions</button>
                <button onClick={this.exportData}>Export Data</button>
                <button onClick={this.budgetPrediction}>Predict Budget</button>
            </div>
        );
    }
}

export default Tracker;



