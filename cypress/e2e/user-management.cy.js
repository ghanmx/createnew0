describe('User Management', () => {
  beforeEach(() => {
    cy.visit('/admin/user-management'); // Adjust this path to match your app's routing
  });

  it('displays the user table', () => {
    cy.get('table').should('be.visible');
    cy.get('th').should('have.length', 5);
    cy.get('th').eq(0).should('contain', 'ID');
    cy.get('th').eq(1).should('contain', 'Name');
    cy.get('th').eq(2).should('contain', 'Email');
    cy.get('th').eq(3).should('contain', 'Role');
    cy.get('th').eq(4).should('contain', 'Status');
  });

  it('displays loading state', () => {
    cy.intercept('GET', '/api/users*', (req) => {
      req.reply((res) => {
        res.delay = 1000;
        res.send();
      });
    }).as('getUsers');

    cy.visit('/admin/user-management');
    cy.get('[role="status"]').should('be.visible');
    cy.wait('@getUsers');
    cy.get('[role="status"]').should('not.exist');
  });

  it('handles pagination', () => {
    cy.get('button').contains('Next').click();
    cy.url().should('include', 'page=2');
    cy.get('button').contains('Previous').click();
    cy.url().should('include', 'page=1');
  });

  it('handles errors', () => {
    cy.intercept('GET', '/api/users*', { statusCode: 500, body: 'Server error' }).as('getUsersError');
    cy.visit('/admin/user-management');
    cy.wait('@getUsersError');
    cy.get('.chakra-alert').should('be.visible').and('contain', 'Failed to fetch users');
  });
});