const express = require('express');
const router = express.Router();
const { addBook, getBooks, getBook, updateBook,deleteBook  } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addBook);
router.get('/', authMiddleware, getBooks);
router.get('/:id', authMiddleware, getBook);
router.put('/:id', authMiddleware, updateBook);
router.delete('/:id', authMiddleware, deleteBook);

module.exports = router;