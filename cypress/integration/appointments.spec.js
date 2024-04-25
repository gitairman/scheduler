describe('Appointments', () => {
  before(() => {
    // root-level hook
    // runs once before all tests
    cy.request('http://localhost:8001/api/debug/reset');
    cy.visit('http://localhost:8000/');
    cy.contains('[data-testid=day]', 'Monday');
  });
  it('should book an interview', () => {
    cy.get(
      ':nth-child(2) > .appointment__add > .appointment__add-button'
    ).click();
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');
    cy.get(':nth-child(1) > .interviewers__item-image').click();
    cy.get('.button--confirm').click();
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
    cy.get(
      ':nth-child(2) > .appointment__card > .appointment__card-right > .appointment__actions > [src="images/edit.png"]'
    ).click({ force: true });
    cy.get(':nth-child(2) > .interviewers__item-image').click();
    cy.get('[data-testid=student-name-input]').clear().type('Aaron Hopkins');
    cy.get('.button--confirm').click();
    cy.get(
      ':nth-child(2) > .appointment__card > .appointment__card-right > .appointment__actions > [src="images/trash.png"]'
    ).click({ force: true });
    cy.get(
      '.appointment__card > .appointment__actions > :nth-child(2)'
    ).click();
    cy.contains(/Deleting/i).should('exist');
    cy.contains(/Deleting/i).should('not.exist');

    cy.contains('.appointment__card--show', 'Aaron Hopkins').should(
      'not.exist'
    );
  });
});
