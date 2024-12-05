const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); // Chemin vers votre fichier de routes principal
const sequelize = require('./config/database'); // Importez votre instance Sequelize

const app = express();

// Middlewares globaux
app.use(cors());
app.use(bodyParser.json());

// Routes principales
app.use('/api', routes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Quelque chose a mal tourné!' });
});

// Synchroniser les modèles avec la base de données
sequelize.sync()
  .then(() => {
    console.log('Base de données synchronisée');
    // Démarrage du serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur lors de la synchronisation de la base de données :', err);
  });

module.exports = app;