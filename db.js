/*************connexin with .env variable file BEGINN******************************************* */
const mysql= require('mysql2');
// Création du pool de connexion
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportation pour l'utiliser ailleurs
module.exports = pool.promise();

/*************connexin with .env variable file END******************************************* */