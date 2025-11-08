require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// app.use(cors({
//     origin: "http://localhost:5173", credentials: true
// }));

app.use(cors()); // This allows requests from all origin

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: (process.env.DB_HOST || 'localhost'),
    database: (process.env.DB_NAME || 'basic_crud_db'),
    user: (process.env.DB_USER || 'root'),
    password: (process.env.DB_PASSWORD || 'password')
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err);
    }
    else {
        console.log('Database connected successfully!');
    }
});

app.post('/add-users', (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error('Error adding user:', err);
            res.status(500).send('Error adding user');
        }
        else {
            res.status(200).send('User added successfully');
        }
    })
});

app.get('/list-users', (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Error fetching users');
    }
    else {
      res.status(200).json(result);
    }
  })
});

app.put('/update-user/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const sql = "UPDATE users SET name=?, email=?, password=? WHERE id=?";
  db.query(sql, [name, email, password, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Error updating user');
    }
    else {
      res.status(200).send('User updated successfully');
    }
  })
});

app.patch('/update-user-name/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = "UPDATE users SET name=? WHERE id=?"
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.error('Error updating user name: ', err);
      res.status(500).send('Error updating user name');
    }
    else {
      res.status(200).send('User name updated successfully')
    }
  })
});

app.patch('/update-user-email/:id', (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const sql = "UPDATE users SET email=? WHERE id=?"
  db.query(sql, [email, id], (err, result) => {
    if (err) {
      console.error('Error updating user email: ', err);
      res.status(500).send('Error updating user email');
    }
    else {
      res.status(200).send('User email updated successfully')
    }
  })
});

app.patch('/update-user-password/:id', (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const sql = "UPDATE users SET password=? WHERE id=?"
  db.query(sql, [password, id], (err, result) => {
    if (err) {
      console.error('Error updating user password: ', err);
      res.status(500).send('Error updating user password');
    }
    else {
      res.status(200).send('User password updated successfully')
    }
  })
});

app.delete('/delete-user/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting User:', err);
      res.status(500).send('Error deleting User');
    }
    else {
      res.status(200).send('User deleted successfully');
    }
  })
});

const PORT = ( process.env.DB_PORT || 3000);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
