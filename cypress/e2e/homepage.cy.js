describe('HomePage Validation Test', () => {
  beforeEach(() => {
    cy.visit('https://denitsa-zhekova.github.io/Hackathon-Challenge-team2/src/index.html');
  });

  it('Checks that username has a label', () => {
    cy.get('label[for="username"]')
    .should('exist') 
    .and('be.visible') 
    .and('contain.text', 'Username'); 
  })

  it('should show an error when the email field is empty', () => {
    cy.get('input[type="email"]').clear(); 
    cy.get('form').submit(); 
    cy.contains('Email is required.').should('be.visible');
  });

  it('should show an error for an invalid email format', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('form').submit(); 
    cy.contains('Please enter a valid email address.').should('be.visible'); 
  });

  it('should show an error for an email that is too long', () => {
    const longEmail = 'a'.repeat(101) + '@example.com';
    cy.get('input[type="email"]').type(longEmail);
    cy.get('form').submit();
    cy.contains('Email address is too long.').should('be.visible'); 
  });

  it('should accept a valid email address', () => {
    cy.get('input[type="email"]').type('test@example.com'); 
    cy.get('form').submit();
    cy.contains('Email is required.').should('not.exist'); 
    cy.contains('Please enter a valid email address.').should('not.exist');
    cy.contains('Email address is too long.').should('not.exist');
  });
});
