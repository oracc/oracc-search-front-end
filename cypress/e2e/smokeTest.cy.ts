describe('basic home visibility', () => {
  it('finds the home page with blurb', () => {
    cy.visit('https://oracc2.museum.upenn.edu/new/');

    cy.get('.home__logo-head').contains('Oracc').should('be.visible');
    cy.contains(
      'Oracc is a collaborative effort to develop a complete corpus of cuneiform '
    );

    cy.get('.cookies').should('be.visible');

    cy.get('.footer').should('be.visible');
    cy.get('.header').should('be.visible');
  });
});

describe('navigate to search', () => {
  it('clicks the search button', () => {
    cy.visit('https://oracc2.museum.upenn.edu/new/');
    cy.get('.header__nav-list-link').contains('Search').click();
  });
});

describe('search process visibiity', () => {
  it('goes through process of a search and checks component visibility', () => {
    cy.visit('https://oracc2.museum.upenn.edu/new/search/');
    cy.get('.search__input').type('water');
    cy.get('.suggestions-content').should('be.visible');
    cy.get('.suggestion').contains('water').click();

    cy.get('.results').should('be.visible');
    cy.get('.bcrumbs').should('be.visible');
    cy.get('.bcrumbs__list-item')
      .contains('Search Results')
      .should('be.visible');
    cy.get('li[data-id="4"]').contains('Urartian').click();
    cy.get('.norms').should('be.visible');
    cy.contains('abava').click();

    cy.get('.bcrumbs').should('be.visible');
    cy.get('.bcrumbs__list-item').contains('occurrences').should('be.visible');

    cy.get('.details').should('be.visible');
    cy.get('.ce-label').contains('32').click();
    cy.contains(
      'I am Darius, the great king, king of kings, the king of Persia'
    ).should('be.visible');
    cy.contains('Darius I 01').should('be.visible');

    cy.contains('a-d-m').click();

    cy.get('.bcrumbs').should('be.visible');
    cy.get('.bcrumbs__list-item').contains('a d-m').should('be.visible');
    cy.get('.norms').should('be.visible');

    cy.get('.bcrumbs__list-item').contains('texts').click();
    cy.get('.details').should('be.visible'); // if this passes then the breadcrumb issue is fixes
  });
});
