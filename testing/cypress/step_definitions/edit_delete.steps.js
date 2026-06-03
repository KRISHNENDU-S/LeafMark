import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import * as LOCATORS from "../locators/locators";
import { loginUser } from "../utility/utility";
import { deleteAllBooks } from "../utility/utility";
import { ROUTES } from "../constants/constants";

When("I click edit on book {string}", (bookname) => {
  cy.contains('[data-testid^="bookname-"]', bookname)
    .parents("tr")
    .find('[data-testid^="edit-btn-"]')
    .click();
});

When("I change status to read", () => {
  cy.get(LOCATORS.TABLE_LOCATORS.editStatus).select("read");
});

When("I add genre {string} in edit", (genre) => {
  cy.get(LOCATORS.TABLE_LOCATORS.editGenres).clear().type(genre);
});

When("I add additional genre {string} in edit", (genre) => {
  cy.get(LOCATORS.TABLE_LOCATORS.editGenres)
    .then($el => {
      const existing = $el.val();
      cy.get(LOCATORS.TABLE_LOCATORS.editGenres).clear().type(`${existing}, ${genre}`);
    });
});

When("I add rating {int} in edit", (rating) => {
  cy.get(LOCATORS.TABLE_LOCATORS.editRating).clear().type(rating);
});

When("I save the edit", () => {
  cy.get(LOCATORS.TABLE_LOCATORS.saveEdit).click();
});

Then("the book should be updated in the table", () => {
  cy.get(LOCATORS.TABLE_LOCATORS.bookTable).should("exist");
});

When("I click delete on book {string}", (bookname) => {
  cy.contains('[data-testid^="bookname-"]', bookname)
    .parents("tr")
    .find('[data-testid^="delete-btn-"]')
    .click();
});

Then("the book should disappear from the table", () => {
  cy.contains('[data-testid^="bookname-"]', "Test Book Two").should("not.exist");
});

Then("delete all books from the table", () => {
  deleteAllBooks();
  cy.get(LOCATORS.TABLE_LOCATORS.noBooks).should("exist");
});

When("I am on home page", () => {
  cy.url().should("include", ROUTES.home);
});