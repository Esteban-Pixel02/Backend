const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function isValidPassword(password) {
  const hasMinLength = password.length >= 7;
  const hasDigit = /\d/.test(password); // contient au moins un chiffre
  return hasMinLength && hasDigit;
}

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 7 caractères et 1 chiffre.'
      });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    
    const hash = await bcrypt.hash(password, 10);

    
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé !' });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect !' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};
