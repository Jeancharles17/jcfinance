const express = require('express');
const bodyParser = require('body-parser');
const plaid = require('plaid');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Load your .env variables
const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } = process.env;

// Initialize the Plaid client using the updated PlaidApi class
const plaidClient = new plaid.PlaidApi(
    new plaid.Configuration({
        basePath: plaid.PlaidEnvironments[PLAID_ENV || 'sandbox'], // Default to sandbox if not specified
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
                'PLAID-SECRET': PLAID_SECRET,
            },
        },
    })
);

// Route to exchange Public Token for Access Token
app.post('/api/exchange_public_token', async (req, res) => {
    const { public_token } = req.body;
    try {
        const tokenResponse = await plaidClient.itemPublicTokenExchange({
            public_token,
        });
        const access_token = tokenResponse.data.access_token;
        res.json({ access_token });
    } catch (error) {
        console.error('Error exchanging public token:', error);
        res.status(500).json({ error: 'Failed to exchange public token' });
    }
});

// Route to fetch transactions using Access Token
app.post('/api/get_transactions', async (req, res) => {
    const { access_token } = req.body;

    // Optional: You can dynamically generate the start and end dates or adjust the range as needed
    const startDate = '2024-01-01';  // Adjust this as needed
    const endDate = '2024-12-31';    // Adjust this as needed

    try {
        const response = await plaidClient.transactionsGet({
            access_token,
            start_date: startDate,
            end_date: endDate,
            options: {
                count: 100, // You can adjust this count or paginate as needed
            },
        });

        const transactions = response.data.transactions;
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Server listening on port 5000
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
