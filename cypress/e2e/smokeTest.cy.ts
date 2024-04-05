const oraccUrl = 'http://localhost:4200/';
describe('basic home visibility', () => {
  it('checks the home page is the search page', () => {
    cy.visit(oraccUrl);

    cy.get('.search__title').contains('Search Oracc').should('be.visible');

    cy.get('.cookies').should('be.visible');

    cy.get('.footer').should('be.visible');
    cy.get('.header').should('be.visible');
  });
});

describe('search process visibiity', () => {
  it('goes through process of a search and checks component visibility', () => {
    cy.visit(oraccUrl);
    // do a search for "water" and check suggestions show
    cy.get('.search__input').type('water');
    cy.get('.suggestions-content').should('be.visible');
    cy.get('.suggestion').contains('watering place').click();

    // check water results table displays and click first row
    cy.get('.results').should('be.visible');
    cy.get('.bcrumbs').should('be.visible');
    cy.get('.bcrumbs__list-item')
      .contains('search results')
      .should('be.visible');
    cy.get('li[data-id="4"]').contains('Middle Babylonian').click();

    // expect details of abava
    cy.get('.glossary').should('be.visible');
    const normalized_forms = cy.get('.norms');
    normalized_forms.should('be.visible');
    normalized_forms.contains('ugu').click();

    // check breadcrumbs show the correct level of traceback and detail page shown
    cy.get('.bcrumbs').should('be.visible');
    cy.get('.bcrumbs__list-item').contains('occurrences').should('be.visible');
    cy.get('.details').should('be.visible');

    // check clicking on an entry reveals the translation and changes the main column to that entry
    cy.get('.ce-label').contains('KUB 03, 103 r 6').click();
    cy.get('.details__panel-main table.transliteration').contains(
      'to send (a message)'
    ).should('be.visible');
    cy.contains('a-ra').should('be.visible');

    // check clicking the "original" text (not translation) goes on to provide details for that word
    cy.contains('a-ra').click();
    cy.get('.bcrumbs').should('be.visible');
    cy.get('.bcrumbs__list-item').contains('a ra').should('be.visible');
    cy.get('.norms').should('be.visible');

    // check breadcrumbs work in a deep search
    cy.get('.bcrumbs__list-item').contains('texts').click();
    cy.get('.details').should('be.visible'); // if this passes then the breadcrumb issue is fixed
  });
});

describe('popups not blank', () => {
  it('checks if popups work properly', () => {
    cy.visit(oraccUrl);
    cy.get('.search__input').type('watering place {enter}');
    cy.contains('ugu').click();
    cy.get('span.sux').eq(1).click();
    cy.contains('(KUB 03, 103 r 6)').click();

    cy.get('#n1344').should('not.be.visible');
    cy.get('span.marker').contains('1').trigger('mouseover');
    cy.get('#n1344').should('be.visible').and('contain.text', 'to give advice');
  });
});
