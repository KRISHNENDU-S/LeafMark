# LeafMark 📚

A private, distraction-free reading log built for readers who want to track their library without social feeds, followers, or noise. Just you and your books.

---

## Why I Built This

Most reading apps push social features — public shelves, friend activity, follower counts. LeafMark is the opposite: a clean, personal reading log where only your data exists. No community. No distractions.

---

## Features

- Add books with title, author, status, rating, and genres
- Track reading status — `read`, `reading`, `to read`
- Rate books on a 1–5 scale
- Tag multiple genres per book
- Edit and delete books inline
- Search by book name or author
- Filter by status, genre, and rating
- Dynamic genre dropdown built from your actual data
- Secure login and signup with JWT authentication

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Vite |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens), Argon2, httpOnly cookies |
| Validation | Zod |

---

## Architecture Decisions

- **JWT with access + refresh tokens** — stateless auth with auto-refresh on expiry
- **Argon2 password hashing** — stronger than bcrypt against GPU attacks
- **httpOnly cookies** — tokens never exposed to JavaScript, XSS-safe
- **Zod validation** — schema-level request validation on all endpoints
- **Dynamic query building** — filters applied conditionally, no hardcoded SQL
- **Normalized DB schema** — books and genres in separate tables with a join table (bookgenre) to support multiple genres per book cleanly

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login, receive tokens |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/books` | Add a book |
| GET | `/api/books` | Get all books (with filters) |
| GET | `/api/books/:id` | Get single book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |

---

## Database Schema

| Table | Columns |
|---|---|
| `users` | userid (PK), username, email, password |
| `books` | bookid (PK), bookname, author, status, rating, userid (FK → users) |
| `genre` | genreid (PK), genrename (UNIQUE) |
| `bookgenre` | bookid (FK → books), genreid (FK → genre), composite PK |
| `refresh_tokens` | token, userid (FK → users), expiry |

---

## Phase 1 Scope

- [x] Database design and normalization
- [x] JWT authentication (signup, login, middleware)
- [x] Book CRUD API with Zod validation
- [x] React frontend with Tailwind CSS
- [x] Search, filter, edit, delete
- [x] Secure cookie-based auth flow

---

## Planned Improvements

- [ ] Deploy to Vercel + Render
- [ ] Cypress E2E test suite
- [ ] GitHub Actions CI/CD pipeline
- [ ] Decimal ratings
- [ ] Pagination for large libraries
- [ ] Sort by rating, title, author
- [ ] Forgot password (email flow)
- [ ] LLM-powered book recommendations
- [ ] Multi-user support with proper data isolation

---

## Local Setup

1. Clone the repo
2. Create `.env` in `/backend` with your PostgreSQL credentials
3. Run `npm install` in both `/backend` and `/frontend`
4. Start backend: `npm run dev` from `/backend`
5. Start frontend: `npm run dev` from `/frontend`

---

## Author

Built by Krishnendu — [GitHub](https://github.com/KRISHNENDU-S)
