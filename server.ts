import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
const db = new Database('wms.db');
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    name TEXT
  );
  
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    name TEXT,
    category TEXT,
    price REAL,
    stock INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    name TEXT,
    type TEXT
  );
`);

// Seed initial user if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)');
  insertUser.run('admin', 'admin123', 'admin', 'System Admin');
  console.log('Created default admin user');
}

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// API Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { code, name, category, price, stock } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO products (code, name, category, price, stock) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(code, name, category, price, stock || 0);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Setup Vite middleware
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
