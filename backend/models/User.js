const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'L\'email est obligatoire'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Veuillez saisir un email valide']
  },
  password: { 
    type: String, 
    required: [true, 'Le mot de passe est obligatoire'] 
  }
});


userSchema.plugin(uniqueValidator, { message: 'Erreur, {PATH} doit être unique.' });

module.exports = mongoose.model('User', userSchema);
