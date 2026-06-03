import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { BASE_URL, USER, ROUTES } from "../constants/constants";
import { SIGNUP_LOCATORS, LOGIN_LOCATORS } from "../locators/locators";

// Signup steps
Given("I am on the signup page", () => {
  cy.visit(BASE_URL + ROUTES.signup);
});

When("I enter valid signup credentials", () => {
  cy.get(SIGNUP_LOCATORS.usernameInput).type(USER.username);
  cy.get(SIGNUP_LOCATORS.emailInput).type(USER.email);
  cy.get(SIGNUP_LOCATORS.passwordInput).type(USER.password);
});

When("I click the signup button", () => {
  cy.intercept("POST", "**/auth/signup").as("signupRequest");
  cy.get(SIGNUP_LOCATORS.submitButton).click();
});

Then("I should see a success response", () => {
  cy.wait("@signupRequest").then((interception) => {
    expect(interception.response.statusCode).to.eq(201);
    expect(interception.response.body).to.have.property("message", "User created");
    expect(interception.response.body.user).to.have.property("username", USER.username);
    expect(interception.response.body.user).to.have.property("email", USER.email);
  });
});

// Login steps
Given("I am on the login page", () => {
  cy.visit(BASE_URL + ROUTES.login);
});

When("I enter valid login credentials", () => {
  cy.get(LOGIN_LOCATORS.emailInput).type(USER.email);
  cy.get(LOGIN_LOCATORS.passwordInput).type(USER.password);
});

When("I click the login button", () => {
  cy.get(LOGIN_LOCATORS.submitButton).click();
});

Then("I should be redirected to the home page", () => {
  cy.url().should("include", ROUTES.home);
});