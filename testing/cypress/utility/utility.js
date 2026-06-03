import { BASE_URL, USER, ROUTES } from "../constants/constants";
import * as LOCATORS from "../locators/locators";

export function loginUser() {
  cy.visit(BASE_URL + ROUTES.login);
  cy.get(LOCATORS.LOGIN_LOCATORS.emailInput).type(USER.email);
  cy.get(LOCATORS.LOGIN_LOCATORS.passwordInput).type(USER.password);
  cy.get(LOCATORS.LOGIN_LOCATORS.submitButton).click();
  cy.url().should("include", ROUTES.home);
  cy.reload();
}

export function deleteAllBooks() {
  cy.request('GET', `${BASE_URL}/api/books`).then(res => {
    cy.log('Books fetched:', JSON.stringify(res.body));
    const books = res.body.books || [];
    cy.log(`Found ${books.length} books to delete`);
    books.forEach(book => {
      cy.request('DELETE', `${BASE_URL}/api/books/${book.bookid}`);
    });
  });
}