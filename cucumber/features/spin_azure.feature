Feature: Spin Azure Silo and Instance

    Scenario: Spin Azure Silo and Instance off Pub Git Repo
        Given I initialize scenario
        Then I register Azure account
        Then I register Silo template
        Then I register Instance template
        Then I create Silo
        Then I create Instance