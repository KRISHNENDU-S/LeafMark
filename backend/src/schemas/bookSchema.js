const { z } = require('zod');

const bookSchema = z.object({
  bookname: z.string().min(1, 'Book name is required'),
  author: z.string().min(1, 'Author is required'),
  status: z.enum(['read', 'reading', 'to read']),
  rating: z.number().min(1).max(5).nullable().optional(),
  genres: z.array(z.string()).optional()
});

module.exports = bookSchema;