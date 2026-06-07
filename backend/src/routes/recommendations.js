const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Feature 1: General recommendations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userid } = req.user;

    const result = await pool.query(
      `SELECT b.bookname, b.author, b.rating, b.status, g.genrename AS genre
       FROM books b
       LEFT JOIN bookgenre bg ON b.bookid = bg.bookid
       LEFT JOIN genre g ON bg.genreid = g.genreid
       WHERE b.userid = $1`,
      [userid]
    );

    const books = result.rows;
    if (books.length === 0) {
      return res.json({ recommendations: [] });
    }

    const bookList = books.map(b =>
      `"${b.bookname}" by ${b.author} (Genre: ${b.genre || 'Unknown'}, Rating: ${b.rating || 'Not rated'}, Status: ${b.status})`
    ).join('\n');

    const prompt = `I have read the following books:\n${bookList}\n\nBased on my reading history, recommend 5 books I might enjoy. Return ONLY a JSON array with no markdown, no backticks, no explanation. Each item must have exactly these fields: title, author, genre, reason. Example: [{"title":"Book Name","author":"Author Name","genre":"Genre","reason":"One sentence reason"}]`;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    const geminiResult = await model.generateContent(prompt);
    const text = geminiResult.response.text().trim();

    const recommendations = JSON.parse(text);
    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Feature 2: Genre pattern
router.get('/genre', authMiddleware, async (req, res) => {
  try {
    const { userid } = req.user;

    const result = await pool.query(
      `SELECT g.genrename AS genre, COUNT(*) AS count
       FROM books b
       JOIN bookgenre bg ON b.bookid = bg.bookid
       JOIN genre g ON bg.genreid = g.genreid
       WHERE b.userid = $1
       GROUP BY g.genrename
       ORDER BY count DESC`,
      [userid]
    );

    const genres = result.rows;
    if (genres.length === 0) {
      return res.json({ recommendations: [] });
    }

    const dominant = genres[0];
    const genreList = genres.map(g => `${g.genre}: ${g.count} books`).join(', ');

    const prompt = `My reading library has the following genre distribution: ${genreList}. My most read genre is "${dominant.genre}". Suggest 3 different genres I might enjoy and recommend 1 specific book from each genre. Return ONLY a JSON array with no markdown, no backticks, no explanation. Each item must have exactly these fields: title, author, genre, reason. Example: [{"title":"Book Name","author":"Author Name","genre":"Genre","reason":"One sentence reason"}]`;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    const geminiResult = await model.generateContent(prompt);
    const text = geminiResult.response.text().trim();

    const recommendations = JSON.parse(text);
    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get genre recommendations' });
  }
});

module.exports = router;