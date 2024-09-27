const mysql = require('mysql2');
const express = require('express');
require('dotenv').config();


const app = express();
app.use(express.json()); // For parsing application/json


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
    connection.end();
});


// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    connection.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    connection.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 3. Filter patients by First Name
app.get('/patients/first_name/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    connection.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/provider_specialty/:provider_specialty', (req, res) => {
    const specialty = req.params.specialty;
    connection.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});





// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
