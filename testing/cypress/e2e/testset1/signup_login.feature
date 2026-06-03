Feature: User Authentication and Login

  Scenario: Successful signup with new user
    Given I am on the signup page
    When I enter valid signup credentials
    And I click the signup button
    Then I should see a success response

  Scenario: Successful login with registered user
    Given I am on the login page
    When I enter valid login credentials
    And I click the login button
    Then I should be redirected to the home page