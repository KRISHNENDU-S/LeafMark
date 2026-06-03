import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import * as LOCATORS from "../locators/locators";

When("I type {string} in search", (query) => {
  cy.get(LOCATORS.FILTER_LOCATORS.searchInput).clear().type(query);
});

Then("only books matching {string} should show", (query) => {
  cy.get(LOCATORS.TABLE_LOCATORS.bookTable).should("exist");
  cy.get('[data-testid^="bookname-"], [data-testid^="author-"]').then($els => {
    const texts = [...$els].map(el => el.textContent.toLowerCase());
    const anyMatch = texts.some(t => t.includes(query.toLowerCase()));
    expect(anyMatch).to.be.true;
  });
});

When("I select status filter {string}", (status) => {
cy.intercept('GET', '**/books?status=*').as('statusFilter');
  cy.get(LOCATORS.FILTER_LOCATORS.filterStatus).select(status);
  cy.wait('@statusFilter');
});

Then("only read books should show", () => {
  cy.intercept('GET', '**/books?status=read').as('readFilter');
  cy.get(LOCATORS.TABLE_LOCATORS.bookTable).should("exist");
  cy.get('table[data-testid="book-table"] tbody tr td:nth-child(4)').each($el => {
    expect($el.text().toLowerCase().trim()).to.eq("read");
  });
});

Then("only to read books should show", () => {
  cy.get(LOCATORS.TABLE_LOCATORS.bookTable).should("exist");
  cy.get('[data-testid^="bookname-"]').should("have.length.greaterThan", 0);
});

Then("only reading books should show", () => {
  cy.get(LOCATORS.TABLE_LOCATORS.bookTable).should("exist");
  cy.get('[data-testid^="bookname-"]').should("have.length.greaterThan", 0);
});

When("I select genre filter {string}", (genre) => {
  cy.get(LOCATORS.FILTER_LOCATORS.filterGenre).select(genre);
});

Then("only books with genre {string} should show", (genre) => {
  cy.get(LOCATORS.TABLE_LOCATORS.bookTable).should("exist");
  cy.get('[data-testid^="genres-"]').each($el => {
    const text = $el.text();
    if (text !== '—') {
      expect(text).to.include(genre);
    }
  });
});

When("I select rating filter {string}", (rating) => {
  cy.get(LOCATORS.FILTER_LOCATORS.filterRating).select(rating);
});

Then("only books with rating 4 should show", () => {
  cy.get(LOCATORS.TABLE_LOCATORS.bookTable).should("exist");
  cy.get('[data-testid^="rating-"]').filter((i, el) => {
    return el.tagName.toLowerCase() === 'td';
  }).each($el => {
    const text = $el.text();
    if (text !== '—') {
      expect(text).to.eq("4");
    }
  });
});