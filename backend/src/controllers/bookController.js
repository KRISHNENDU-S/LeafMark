const pool = require('../config/db');
const bookSchema = require('../schemas/bookSchema');

const addBook = async (req, res) => {
  try {
    const parsed = bookSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { bookname, author, status, rating, genres } = parsed.data;
    const userid = req.user.userid;

    const bookResult = await pool.query(
      'INSERT INTO books (bookname, author, status, rating, userid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [bookname, author, status, rating || null, userid]
    );

    const book = bookResult.rows[0];

    if (genres && genres.length > 0) {
      for (const genrename of genres) {
        let genreResult = await pool.query(
          'SELECT genreid FROM genre WHERE LOWER(genrename) = LOWER($1)',
          [genrename]
        );

        if (genreResult.rows.length === 0) {
          genreResult = await pool.query(
            'INSERT INTO genre (genrename) VALUES ($1) RETURNING genreid',
            [genrename]
          );
        }

        const genreid = genreResult.rows[0].genreid;

        await pool.query(
          'INSERT INTO bookgenre (bookid, genreid) VALUES ($1, $2)',
          [book.bookid, genreid]
        );
      }
    }

    res.status(201).json({ message: 'Book added successfully', book });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBooks = async (req, res) => {
  try {
    const userid = req.user.userid;
    const { status, author, rating, genre, bookname } = req.query;
    
    let query = `
      SELECT b.bookid, b.bookname, b.author, b.status, b.rating,
             COALESCE(array_agg(g.genrename) FILTER (WHERE g.genrename IS NOT NULL), '{}') AS genres
      FROM books b
      LEFT JOIN bookgenre bg ON b.bookid = bg.bookid
      LEFT JOIN genre g ON bg.genreid = g.genreid
      WHERE b.userid = $1
    `;

    const values = [userid];
    let counter = 2;

    if (status) {
      query += ` AND b.status = $${counter}`;
      values.push(status);
      counter++;
    }

    if (author) {
      query += ` AND LOWER(b.author) LIKE LOWER($${counter})`;
      values.push(`%${author}%`);
      counter++;
    }

    if (bookname) {
  query += ` AND LOWER(b.bookname) LIKE LOWER($${counter})`;
  values.push(`%${bookname}%`);
  counter++;
}

    if (rating) {
      query += ` AND b.rating = $${counter}`;
      values.push(Number(rating));
      counter++;
    }

    if (genre) {
      query += ` AND b.bookid IN (
        SELECT bg2.bookid FROM bookgenre bg2
        JOIN genre g2 ON bg2.genreid = g2.genreid
        WHERE LOWER(g2.genrename) = LOWER($${counter})
      )`;
      values.push(genre);
      counter++;
    }

    query += ` GROUP BY b.bookid`;

    const result = await pool.query(query, values);
    res.status(200).json({ books: result.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBook = async (req, res) => {
  try {
    const userid = req.user.userid;
    const bookid = req.params.id;

    const result = await pool.query(
      `SELECT b.bookid, b.bookname, b.author, b.status, b.rating,
              COALESCE(array_agg(g.genrename) FILTER (WHERE g.genrename IS NOT NULL), '{}') AS genres
       FROM books b
       LEFT JOIN bookgenre bg ON b.bookid = bg.bookid
       LEFT JOIN genre g ON bg.genreid = g.genreid
       WHERE b.bookid = $1 AND b.userid = $2
       GROUP BY b.bookid`,
      [bookid, userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ book: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const userid = req.user.userid;
    const bookid = req.params.id;

    const { bookname, author, status, rating, genres } = req.body;

    const existing = await pool.query(
      'SELECT * FROM books WHERE bookid = $1 AND userid = $2',
      [bookid, userid]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

const current = existing.rows[0];

const updatedBook = await pool.query(
  `UPDATE books 
   SET bookname = COALESCE($1, bookname),
       author = COALESCE($2, author),
       status = COALESCE($3, status),
       rating = $4
   WHERE bookid = $5 AND userid = $6
   RETURNING *`,
  [
    bookname,
    author,
    status,
    'rating' in req.body ? req.body.rating : current.rating,
    bookid,
    userid
  ]
);

    if (genres !== undefined) {
      await pool.query('DELETE FROM bookgenre WHERE bookid = $1', [bookid]);

      for (const genrename of genres) {
        let genreResult = await pool.query(
          'SELECT genreid FROM genre WHERE LOWER(genrename) = LOWER($1)',
          [genrename]
        );

        if (genreResult.rows.length === 0) {
          genreResult = await pool.query(
            'INSERT INTO genre (genrename) VALUES ($1) RETURNING genreid',
            [genrename]
          );
        }

        const genreid = genreResult.rows[0].genreid;

        await pool.query(
          'INSERT INTO bookgenre (bookid, genreid) VALUES ($1, $2)',
          [bookid, genreid]
        );
      }
    }

const updatedResult = await pool.query(
  `SELECT b.bookid, b.bookname, b.author, b.status, b.rating,
          COALESCE(array_agg(g.genrename) FILTER (WHERE g.genrename IS NOT NULL), '{}') AS genres
   FROM books b
   LEFT JOIN bookgenre bg ON b.bookid = bg.bookid
   LEFT JOIN genre g ON bg.genreid = g.genreid
   WHERE b.bookid = $1 AND b.userid = $2
   GROUP BY b.bookid`,
  [bookid, userid]
);

res.status(200).json({ message: 'Book updated successfully', book: updatedResult.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const userid = req.user.userid;
    const bookid = req.params.id;

    const existing = await pool.query(
      'SELECT * FROM books WHERE bookid = $1 AND userid = $2',
      [bookid, userid]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await pool.query('DELETE FROM bookgenre WHERE bookid = $1', [bookid]);
    await pool.query('DELETE FROM books WHERE bookid = $1 AND userid = $2', [bookid, userid]);

    res.status(200).json({ message: 'Book deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addBook, getBooks, getBook, updateBook, deleteBook };