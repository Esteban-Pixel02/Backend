const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // ← ici

// 🔽 Import des routes
const authRoutes = require('./routes/auth');

// 🔽 Configuration et connexion
dotenv.config();
connectDB();

// 🔽 Middleware JSON
app.use(cors());              // ← ici
app.use(express.json());

// 🔽 Utilisation des routes
app.use('/api/auth', authRoutes); // ← URL des endpoints : /api/auth/signup et /api/auth/login

// 🔽 Route d'accueil
app.get('/', (req, res) => {
  res.send('API en ligne');
});

module.exports = app;
