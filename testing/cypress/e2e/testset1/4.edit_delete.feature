Feature: Edit and Delete Books

  Background:
    Given I am logged in

  Scenario: Edit a book change status to read add genre and rating
    When I click edit on book "Test Book One"
    And I change status to read
    And I add genre "Mystery" in edit
    And I add rating 3 in edit
    And I save the edit
    Then the book should be updated in the table

  Scenario: Edit a book add one more genre
    When I click edit on book "Test Book Three"
    And I add additional genre "Thriller" in edit
    And I save the edit
    Then the book should be updated in the table

  Scenario: Delete a to read book
    When I click delete on book "Test Book Two"
    Then the book should disappear from the table

  Scenario: Delete all remaining books
    When I am on home page
    Then delete all books from the table