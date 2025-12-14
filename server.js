const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createPool({
  host: 'localhost', // Em produção, mude para o IP do banco se necessário
  user: 'marioe98_emie',
  password: 'Emie2025@',
  database: 'marioe98_baby',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL!');
    connection.release();
  }
});

// --- Auth Routes ---

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, phone, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email já cadastrado' });
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, name, email, phone });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });
    
    const user = results[0];
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
  });
});

// --- Generic Helpers ---
const handleQuery = (res, sql, params = []) => {
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// --- Sessions ---
app.get('/api/sessions', (req, res) => {
  const { userId } = req.query;
  handleQuery(res, 'SELECT * FROM nursing_sessions WHERE user_id = ? ORDER BY start_time DESC', [userId]);
});

app.post('/api/sessions', (req, res) => {
  const { id, userId, startTime, endTime, durationSeconds, hasPee, hasPoop, notes } = req.body;
  const sql = 'INSERT INTO nursing_sessions (id, user_id, start_time, end_time, duration_seconds, has_pee, has_poop, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [id, userId, new Date(startTime), new Date(endTime), durationSeconds, hasPee, hasPoop, notes];
  handleQuery(res, sql, params);
});

app.delete('/api/sessions/:id', (req, res) => {
  handleQuery(res, 'DELETE FROM nursing_sessions WHERE id = ?', [req.params.id]);
});

// --- Baths ---
app.get('/api/baths', (req, res) => {
  const { userId } = req.query;
  handleQuery(res, 'SELECT id, date_time as dateTime, notes FROM baths WHERE user_id = ? ORDER BY date_time DESC', [userId]);
});

app.post('/api/baths', (req, res) => {
  const { id, userId, dateTime } = req.body;
  handleQuery(res, 'INSERT INTO baths (id, user_id, date_time) VALUES (?, ?, ?)', [id, userId, new Date(dateTime)]);
});

app.delete('/api/baths/:id', (req, res) => {
  handleQuery(res, 'DELETE FROM baths WHERE id = ?', [req.params.id]);
});

// --- Weights ---
app.get('/api/weights', (req, res) => {
  const { userId } = req.query;
  handleQuery(res, 'SELECT id, date_time as dateTime, weight_kg as weightKg FROM weights WHERE user_id = ? ORDER BY date_time DESC', [userId]);
});

app.post('/api/weights', (req, res) => {
  const { id, userId, dateTime, weightKg } = req.body;
  handleQuery(res, 'INSERT INTO weights (id, user_id, date_time, weight_kg) VALUES (?, ?, ?, ?)', [id, userId, new Date(dateTime), weightKg]);
});

app.delete('/api/weights/:id', (req, res) => {
  handleQuery(res, 'DELETE FROM weights WHERE id = ?', [req.params.id]);
});

// --- Heights ---
app.get('/api/heights', (req, res) => {
  const { userId } = req.query;
  handleQuery(res, 'SELECT id, date_time as dateTime, height_cm as heightCm FROM heights WHERE user_id = ? ORDER BY date_time DESC', [userId]);
});

app.post('/api/heights', (req, res) => {
  const { id, userId, dateTime, heightCm } = req.body;
  handleQuery(res, 'INSERT INTO heights (id, user_id, date_time, height_cm) VALUES (?, ?, ?, ?)', [id, userId, new Date(dateTime), heightCm]);
});

app.delete('/api/heights/:id', (req, res) => {
  handleQuery(res, 'DELETE FROM heights WHERE id = ?', [req.params.id]);
});

// --- Diary ---
app.get('/api/diary', (req, res) => {
  const { userId } = req.query;
  handleQuery(res, 'SELECT id, date_time as dateTime, content FROM diary_entries WHERE user_id = ? ORDER BY date_time DESC', [userId]);
});

app.post('/api/diary', (req, res) => {
  const { id, userId, dateTime, content } = req.body;
  handleQuery(res, 'INSERT INTO diary_entries (id, user_id, date_time, content) VALUES (?, ?, ?, ?)', [id, userId, new Date(dateTime), content]);
});

app.delete('/api/diary/:id', (req, res) => {
  handleQuery(res, 'DELETE FROM diary_entries WHERE id = ?', [req.params.id]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});