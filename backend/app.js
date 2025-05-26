const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 🔽 importe les routes
const helloRoutes = require('./routes/hello');

dotenv.config();
connectDB();

app.use(express.json());

// 🔽 utilise les routes
app.use('/hello', helloRoutes);

app.get('/', (req, res) => {
  res.send('API en ligne');
});

module.exports = app;
