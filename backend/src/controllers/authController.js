const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  try {
    const existing = await pool.query(
      'SELECT userid FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await argon2.hash(password);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING userid, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    const user = result.rows[0];

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const accessToken = jwt.sign(
      { userid: user.userid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      { userid: user.userid },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    await pool.query(
      'INSERT INTO refresh_tokens (userid, token) VALUES ($1, $2)',
      [user.userid, refreshToken]
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const me = async (req, res) => {
  try {
    const userid = req.user.userid;

    const result = await pool.query(
      'SELECT userid, username, email FROM users WHERE userid = $1',
      [userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, me };