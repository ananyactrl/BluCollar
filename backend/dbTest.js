// dbTest.js
require('dotenv').config();
const mysql = require('mysql2');

console.log('🌐 Starting DB test...');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,     // should be metro.proxy.rlwy.net
  port: process.env.DB_PORT,     // should be 21086
  user: process.env.DB_USER,     // root
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ DB Connection Failed:', err.message);
  } else {
    console.log('✅ Connected to Railway DB successfully!');
  }
  connection.end();
});
