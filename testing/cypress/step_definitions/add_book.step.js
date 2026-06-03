import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import * as LOCATORS from "../locators/locators";
import { BOOKS, ROUTES } from "../constants/constants";
import { loginUser, deleteAllBooks } from "../utility/utility";
Given("I am logged in", () => {
  loginUser();
});

And("all books are cleared", () => {
  deleteAllBooks();
});

When("I click add book", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.addBookBtn).click();
});

When("I enter book name and author for basic reading", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.bookName).type(BOOKS.basic_reading.bookname);
  cy.get(LOCATORS.BOOK_LOCATORS.bookAuthor).type(BOOKS.basic_reading.author);
});

When("I enter book name and author for basic to read", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.bookName).type(BOOKS.basic_to_read.bookname);
  cy.get(LOCATORS.BOOK_LOCATORS.bookAuthor).type(BOOKS.basic_to_read.author);
});

When("I enter book name and author for with genre", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.bookName).type(BOOKS.with_genre.bookname);
  cy.get(LOCATORS.BOOK_LOCATORS.bookAuthor).type(BOOKS.with_genre.author);
});

When("I enter book name and author for full", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.bookName).type(BOOKS.full.bookname);
  cy.get(LOCATORS.BOOK_LOCATORS.bookAuthor).type(BOOKS.full.author);
});

When("I select reading status", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.statusReading).click();
});

When("I select to read status", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.statusToRead).click();
});

When("I select read status", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.statusRead).click();
});

When("I enter a genre", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.genreInput(0)).type(BOOKS.with_genre.genre);
});

When("I select rating 4", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.rating(4)).click();
});

When("I submit the book", () => {
  cy.get(LOCATORS.BOOK_LOCATORS.submitBook).click();
});

Then("the book should appear in the table", () => {
  cy.get(LOCATORS.TABLE_LOCATORS.bookTable).should("exist");
});