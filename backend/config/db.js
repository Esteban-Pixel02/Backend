const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // ← à AJOUTER ici pour charger le .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Connexion à MongoDB échouée :', error.message);
    process.exit(1); // Arrête l'app en cas d'erreur
  }
};

module.exports = connectDB;
