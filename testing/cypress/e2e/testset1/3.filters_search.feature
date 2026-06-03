Feature: Filters and Search

  Background:
    Given I am logged in

  Scenario: Search by book name
    When I type "Test Book One" in search
    Then only books matching "Test Book One" should show

  Scenario: Search by author name
    When I type "Author Two" in search
    Then only books matching "Author Two" should show

  Scenario: Filter by status read
    When I select status filter "read"
    Then only read books should show

  Scenario: Filter by status to read
    When I select status filter "to read"
    Then only to read books should show

  Scenario: Filter by status reading
    When I select status filter "reading"
    Then only reading books should show

  Scenario: Filter by genre
    When I select genre filter "Fiction"
    Then only books with genre "Fiction" should show

  Scenario: Filter by rating
    When I select rating filter "4"
    Then only books with rating 4 should show