Feature: Add Book

  Background:
    Given I am logged in
    
  Scenario: Add book with name author and reading status
    When I click add book
    And I enter book name and author for basic reading
    And I select reading status
    And I submit the book
    Then the book should appear in the table

  Scenario: Add book with name author and to read status
    When I click add book
    And I enter book name and author for basic to read
    And I select to read status
    And I submit the book
    Then the book should appear in the table

  Scenario: Add book with name author reading status and genre
    When I click add book
    And I enter book name and author for with genre
    And I select reading status
    And I enter a genre
    And I submit the book
    Then the book should appear in the table

  Scenario: Add book with name author read status genre and rating
    When I click add book
    And I enter book name and author for full
    And I select read status
    And I enter a genre
    And I select rating 4
    And I submit the book
    Then the book should appear in the table