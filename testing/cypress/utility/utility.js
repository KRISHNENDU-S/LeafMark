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
  cy.get('body').then($body => {
    if ($body.find('[data-testid^="delete-btn-"]').length > 0) {
      const initialCount = $body.find('[data-testid^="delete-btn-"]').length;
      cy.get('[data-testid^="delete-btn-"]').first().click();
      cy.get('[data-testid^="delete-btn-"]').should('have.length', initialCount - 1);
      deleteAllBooks();
    }
  });
}