const Book = require('../models/bookModel');
const { Op } = require('sequelize');
const Joi = require('joi');
const sequelize = require('../config/database');

// Fonction utilitaire pour vérifier l'existence d'un livre
const findBookById = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) {
    throw new Error('Livre non trouvé');
  }
  return book;
};

// Schéma de validation pour les livres
const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  isbn: Joi.string().optional(),
  publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()),
  category: Joi.string().optional(),
  available: Joi.boolean().optional(),
});

// Création d'un nouveau livre
exports.createBook = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details,
      });
    }

    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Erreur de validation',
        details: err.errors.map(e => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    console.error('Erreur lors de la création du livre :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la création du livre' });
  }
};

// Récupération d'un livre par ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await findBookById(id);
    res.json(book);
  } catch (err) {
    console.error('Erreur lors de la récupération du livre :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du livre' });
  }
};

// Récupération paginée de tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: books } = await Book.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      totalBooks: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      books,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des livres :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des livres' });
  }
};

// Mise à jour d'un livre
exports.updateBook = async (req, res) => {
  console.log('updateBook appelé avec id:', req.params.id);
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validation des données
    const { error } = bookSchema.validate(updatedData, { allowUnknown: true });
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details,
      });
    }

    const book = await findBookById(id);
    await book.update(updatedData);

    res.status(200).json({
      message: 'Livre mis à jour avec succès',
      book,
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du livre :', err);
    res.status(500).json({
      error: err.message || 'Erreur serveur lors de la mise à jour du livre',
    });
  }
};

// Suppression d'un livre
exports.deleteBook = async (req, res) => {
  console.log('deleteBook appelé avec id:', req.params.id);
  try {
    const { id } = req.params;

    const book = await findBookById(id);
    await book.destroy();
    res.status(200).json({ message: 'Livre supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du livre :', err);
    res.status(500).json({ error: err.message || 'Erreur serveur lors de la suppression du livre' });
  }
};

// Recherche de livres avec des conditions dynamiques
exports.searchBooks = async (req, res) => {
    try {
      const conditions = [];
      const { title, author, category, publishedYear, isbn } = req.query;
  
      if (title) {
        conditions.push({ title: { [Op.iLike]: `%${title}%` } });
      }
      if (author) {
        conditions.push({ author: { [Op.iLike]: `%${author}%` } });
      }
      if (category) {
        conditions.push({ category: { [Op.iLike]: `%${category}%` } });
      }
      if (publishedYear) {
        conditions.push({ publishedYear: publishedYear });
      }
      if (isbn) {
        conditions.push({ isbn: { [Op.iLike]: `%${isbn}%` } });
      }
  
      const books = await Book.findAll({
        where: {
          [Op.and]: conditions,
        },
        limit: 20,
      });
  
      res.json(books);
    } catch (err) {
      console.error('Erreur lors de la recherche de livres :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la recherche de livres' });
    }
  };

// Statistiques sur les livres
exports.getStatistics = async (req, res) => {
    try {
      // Nombre de livres par catégorie
      const booksByCategory = await Book.findAll({
        attributes: ['category', [sequelize.fn('COUNT', sequelize.col('category')), 'count']],
        group: ['category'],
        raw: true,
      }).map((entry) => ({
        category: entry.category || 'Inconnu',
        count: parseInt(entry.count, 10),
      }));
  
      // Répartition par année de publication
      const booksByYear = await Book.findAll({
        attributes: ['publishedYear', [sequelize.fn('COUNT', sequelize.col('publishedYear')), 'count']],
        group: ['publishedYear'],
        raw: true,
      }).map((entry) => ({
        year: entry.publishedYear || 'Inconnu',
        count: parseInt(entry.count, 10),
      }));
  
      // Nombre de livres disponibles/inutilisables
      const booksAvailability = await Book.findAll({
        attributes: ['available', [sequelize.fn('COUNT', sequelize.col('available')), 'count']],
        group: ['available'],
        raw: true,
      }).map((entry) => ({
        available: entry.available,
        count: parseInt(entry.count, 10),
      }));
  
      res.json({
        booksByCategory,
        booksByYear,
        booksAvailability,
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
    }
  };  