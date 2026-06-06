const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (!refreshToken) {
      return res.status(401).json({ message: 'Session expired, please login again' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      const result = await pool.query(
        'SELECT * FROM refresh_tokens WHERE userid = $1 AND token = $2',
        [decoded.userid, refreshToken]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Session expired, please login again' });
      }

      const newRefreshToken = jwt.sign(
        { userid: decoded.userid },
        process.env.JWT_SECRET,
        { expiresIn: '90d' }
      );

      await pool.query(
        'DELETE FROM refresh_tokens WHERE userid = $1 AND token = $2',
        [decoded.userid, refreshToken]
      );

      await pool.query(
        'INSERT INTO refresh_tokens (userid, token) VALUES ($1, $2)',
        [decoded.userid, newRefreshToken]
      );

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 90 * 24 * 60 * 60 * 1000,
      });

      const newAccessToken = jwt.sign(
        { userid: decoded.userid },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Session expired, please login again' });
    }
  }
};

module.exports = authMiddleware;