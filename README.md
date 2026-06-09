# LeafMark 📚

A private, distraction-free reading log built for readers who want to track their library without social feeds, followers, or noise. Just you and your books.

🔗 **[Live Demo](https://leaf-mark.vercel.app)** &nbsp;|&nbsp; 🎥 **[Watch Demo](https://www.loom.com/share/eda033af84c94413a42e145bb18fb689)**

---

## Why I Built This

Most reading apps push social features — public shelves, friend activity, follower counts. LeafMark is the opposite: a clean, personal reading log where only your data exists. No community. No distractions.

---

## Features

- Add books with title, author, status, rating, and genres
- Track reading status — `read`, `reading`, `to read`
- Rate books on a 1–5 scale (decimal support — 4.5, 3.5, etc.)
- Tag multiple genres per book
- Edit and delete books inline
- Search by title or author
- Filter by status, genre, and rating
- Dynamic genre dropdown built from your actual data
- Case-insensitive duplicate detection
- Secure login and signup with JWT authentication
- AI-powered book recommendations based on your library
- Genre pattern suggestions — discover adjacent genres you might like

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Vite |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens), Argon2, httpOnly cookies |
| Validation | Zod |
| AI | Google Gemini API (gemini-3.1-flash-lite) |
| Testing | Cypress, Cucumber (BDD) |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend), Render (backend + DB) |

---

## Architecture Decisions

- **JWT with access + refresh tokens** — stateless auth with token rotation on every refresh
- **Argon2 password hashing** — stronger than bcrypt against GPU attacks
- **httpOnly cookies** — tokens never exposed to JavaScript, XSS-safe
- **Zod validation** — schema-level request validation on all endpoints
- **Dynamic query building** — filters applied conditionally, no hardcoded SQL
- **Normalized DB schema** — books and genres in separate tables with a `bookgenre` join table for clean multi-genre support
- **DB indexes** — on `books.userid`, `refresh_tokens.userid`, `refresh_tokens.token` for query performance
- **Gemini API key server-side only** — never exposed to the frontend; backend queries DB and calls Gemini in one flow
- **Structured JSON prompting** — Gemini prompted to return strict JSON with no markdown artifacts for reliable parsing

---

## Trade-offs & Known Limitations

| Decision | Reasoning |
|---|---|
| **Multi-user support deferred** | Schema is forward-thinking — `userid` FK on books, normalized genre table. Splitting into a `books` master table and `userbooks` table was deliberately deferred since LeafMark is a single-user app. The architecture supports it; the scope doesn't require it yet. |
| **Pagination not implemented** | A personal reading log stays small by nature. Acceptable trade-off for scope — the filter and search system handles discoverability instead. |
| **Forgot password not implemented** | Requires an email service (SendGrid, Resend, etc.). Deferred as out of scope for v1 — the infrastructure decision (transactional email provider) warrants its own phase. |
| **Access tokens valid post-logout (up to 30 days)** | Stateless JWTs can't be invalidated server-side without a denylist. Acceptable for a personal app where data sensitivity is low. |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login, receive tokens |
| POST | `/api/auth/logout` | Logout, clear tokens |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/books` | Add a book |
| GET | `/api/books` | Get all books (with filters) |
| GET | `/api/books/:id` | Get single book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| GET | `/api/recommendations` | AI book recommendations based on library |
| GET | `/api/recommendations/genre` | Genre pattern suggestions |

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

## What's Shipped

- [x] Database design and normalization
- [x] JWT authentication with token rotation
- [x] Book CRUD API with Zod validation
- [x] React frontend with Tailwind CSS
- [x] Search, filter, inline edit and delete
- [x] Decimal ratings
- [x] Case-insensitive duplicate detection
- [x] Responsive layout
- [x] Logout endpoint
- [x] DB indexes
- [x] Cypress E2E test suite (16/16 scenarios, BDD pattern)
- [x] GitHub Actions CI/CD pipeline
- [x] Deployed — Vercel + Render
- [x] AI book recommendations (Gemini)
- [x] Genre pattern suggestions (Gemini)

---

## Planned

- [ ] Pagination for large libraries
- [ ] Sort by rating, title, author
- [ ] Forgot password (email flow)

---

## Local Setup

1. Clone the repo
2. Create `.env` in `/backend` with your PostgreSQL credentials and Gemini API key
3. Run `npm install` in both `/backend` and `/frontend`
4. Start backend: `npm run dev` from `/backend`
5. Start frontend: `npm run dev` from `/frontend`

---

## Author

Built by Krishnendu — [GitHub](https://github.com/KRISHNENDU-S)