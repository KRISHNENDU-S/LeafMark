export const SIGNUP_LOCATORS = {
  usernameInput: '[data-testid="signup-username"]',
  emailInput: '[data-testid="signup-email"]',
  passwordInput: '[data-testid="signup-password"]',
  submitButton: '[data-testid="signup-submit"]'
};

export const LOGIN_LOCATORS = {
  emailInput: '[data-testid="login-email"]',
  passwordInput: '[data-testid="login-password"]',
  submitButton: '[data-testid="login-submit"]'
};

export const BOOK_LOCATORS = {
  addBookBtn: '[data-testid="add-book-btn"]',
  bookName: '[data-testid="book-name"]',
  bookAuthor: '[data-testid="book-author"]',
  statusRead: '[data-testid="status-read"]',
  statusToRead: '[data-testid="status-to-read"]',
  statusReading: '[data-testid="status-reading"]',
  genreInput: (i) => `[data-testid="genre-input-${i}"]`,
  rating: (n) => `[data-testid="rating-${n}"]`,
  submitBook: '[data-testid="submit-book"]',
};

export const TABLE_LOCATORS = {
  bookTable: '[data-testid="book-table"]',
  noBooks: '[data-testid="no-books"]',
  bookRow: (id) => `[data-testid="book-row-${id}"]`,
  booknameCell: (id) => `[data-testid="bookname-${id}"]`,
  editBtn: (id) => `[data-testid="edit-btn-${id}"]`,
  deleteBtn: (id) => `[data-testid="delete-btn-${id}"]`,
  editBookname: '[data-testid="edit-bookname"]',
  editAuthor: '[data-testid="edit-author"]',
  editStatus: '[data-testid="edit-status"]',
  editGenres: '[data-testid="edit-genres"]',
  editRating: '[data-testid="edit-rating"]',
  saveEdit: '[data-testid="save-edit"]',
  cancelEdit: '[data-testid="cancel-edit"]',
};

export const FILTER_LOCATORS = {
  searchInput: '[data-testid="search-input"]',
  filterStatus: '[data-testid="filter-status"]',
  filterGenre: '[data-testid="filter-genre"]',
  filterRating: '[data-testid="filter-rating"]',
};
