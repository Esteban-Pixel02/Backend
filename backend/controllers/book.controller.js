const Book = require('../models/Book');
const fs = require('fs');

// Ajouter un livre
exports.createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      averageRating: 0,
      ratings: []
    });

    await book.save();
    res.status(201).json({ message: 'Livre enregistré avec succès !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Modifier un livre 
exports.updateBook = async (req, res, next) => {
  try {
    let bookObject;

    if (req.file) {
      bookObject = JSON.parse(req.body.book);
      bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    } else {
      bookObject = { ...req.body };
    }

    const bookId = req.params.id;
    const userId = req.auth.userId;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    
    if (book.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    
    await Book.updateOne({ _id: bookId },bookObject );

    res.status(200).json({ message: 'Livre mis à jour !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer un livre
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé !' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupérer tous les livres
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.auth.userId;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    // Vérifier que c'est bien le propriétaire qui supprime
    if (book.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    // Supprimer l'image du serveur
    if (book.imageUrl) {
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) console.error('Erreur suppression image:', err);
      });
    }
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({ message: 'Livre supprimé avec succès' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
};

exports.rateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId, rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    const hasRated = book.ratings.some(r => r.userId === userId);
    if (hasRated) {
      return res.status(403).json({ message: 'Vous avez déjà noté ce livre' });
    }

    book.ratings.push({ userId, grade: rating });

    const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = total / book.ratings.length;

    await book.save();
    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la notation' });
  }
};


exports.getBestRatedBooks = async (req, res) => {
  try {
    console.log('getBestRatedBooks appelé');
    const books = await Book.find({ averageRating: { $ne: null } })
      .sort({ averageRating: -1 })
      .limit(3);
    console.log('Livres trouvés:', books.length);
    res.status(200).json(books);
  } catch (error) {
    console.error('Erreur getBestRatedBooks:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

