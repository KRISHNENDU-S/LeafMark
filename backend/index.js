require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  // origin: 'http://localhost:5173',
   origin: ['http://localhost:5173', 'https://leaf-mark.vercel.app'],
  credentials: true
}));

const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

const bookRoutes = require('./src/routes/books');
app.use('/api/books', bookRoutes);

const authMiddleware = require('./src/middleware/authMiddleware');

app.get('/', (req, res) => {
  res.json({ message: 'LeafMark API running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const recommendationsRouter = require('./src/routes/recommendations');
app.use('/api/recommendations', recommendationsRouter);