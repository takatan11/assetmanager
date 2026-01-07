const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./assets.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create assets table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        purchase_date TEXT,
        purchase_price REAL,
        status TEXT DEFAULT 'active',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// API Routes

// Get all assets
app.get('/api/assets', (req, res) => {
  db.all('SELECT * FROM assets ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ assets: rows });
  });
});

// Get single asset
app.get('/api/assets/:id', (req, res) => {
  db.get('SELECT * FROM assets WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }
    res.json({ asset: row });
  });
});

// Create new asset
app.post('/api/assets', (req, res) => {
  const { name, category, purchase_date, purchase_price, status, description } = req.body;
  
  if (!name || !category) {
    res.status(400).json({ error: 'Name and category are required' });
    return;
  }

  db.run(
    'INSERT INTO assets (name, category, purchase_date, purchase_price, status, description) VALUES (?, ?, ?, ?, ?, ?)',
    [name, category, purchase_date, purchase_price, status || 'active', description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        message: 'Asset created successfully'
      });
    }
  );
});

// Update asset
app.put('/api/assets/:id', (req, res) => {
  const { name, category, purchase_date, purchase_price, status, description } = req.body;
  
  if (!name || !category) {
    res.status(400).json({ error: 'Name and category are required' });
    return;
  }

  db.run(
    'UPDATE assets SET name = ?, category = ?, purchase_date = ?, purchase_price = ?, status = ?, description = ? WHERE id = ?',
    [name, category, purchase_date, purchase_price, status, description, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }
      res.json({ message: 'Asset updated successfully' });
    }
  );
});

// Delete asset
app.delete('/api/assets/:id', (req, res) => {
  db.run('DELETE FROM assets WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }
    res.json({ message: 'Asset deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Asset Manager server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
