export const BASE_URL = Cypress.config('baseUrl');

export const USER = {
  username: "testuser",
  email: "testuser@leafmark.com",
  password: "Test@1234"
};

export const ROUTES = {
  signup: "/signup",
  login: "/",
  home: "/home"
};

export const BOOKS = {
  basic_reading: { bookname: "Test Book One", author: "Author One", status: "reading" },
  basic_to_read: { bookname: "Test Book Two", author: "Author Two", status: "to-read" },
  with_genre: { bookname: "Test Book Three", author: "Author Three", status: "reading", genre: "Fiction" },
  full: { bookname: "Test Book Four", author: "Author Four", status: "read", genre: "Fantasy", rating: 4 }
}