const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book.routes'); 


dotenv.config();
connectDB();


app.use(cors());
app.use(express.json());

// 🔽 Servir les images statiques
app.use('/images', express.static('images'));

// 🔽 Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); // ← ajout ici

// 🔽 Route d'accueil
app.get('/', (req, res) => {
  res.send('API en ligne');
});

module.exports = app;
