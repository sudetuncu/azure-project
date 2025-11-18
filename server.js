const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Azure'da DB_CONNECTION ortam değişkeninden gelecek
const connectionString = process.env.DB_CONNECTION;

if (!connectionString) {
  console.error('DB_CONNECTION environment variable is not set!');
}

const client = new Client({
  connectionString,
});

async function start() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    app.get('/', (req, res) => {
      res.send('API is running and DB connection is OK ✅');
    });

    app.get('/test-db', async (req, res) => {
      try {
        const result = await client.query('SELECT NOW() as now');
        res.json({
          message: 'DB query worked!',
          time: result.rows[0].now,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB query failed', details: err.message });
      }
    });

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err);
    process.exit(1);
  }
}

start();
