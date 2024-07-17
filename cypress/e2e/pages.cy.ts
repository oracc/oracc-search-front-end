describe('home page', () => {
  it('is the search page', () => {
    cy.visit("/");

    cy.get('.cookies').should('be.visible');

    cy.get('.footer').should('be.visible');
    cy.get('.header').should('be.visible');
  });
});

describe('footnote popup', () => {
  it('works properly', () => {
    cy.visit("/");
    const search = "king";
    const result = "Abdi-Liʾti";
    const ref = "Sennacherib 4 36";
    cy.get('.search__input').type(search);
    cy.get('.suggestion').contains(search).click();
    cy.get('.results__table-row').contains(result).click();
    cy.get('.forms .icountu').click();
    cy.get('.details__panel-main').contains(ref).click();

    cy.get('p.note').should('not.be.visible');
    cy.get('span.marker').first().trigger('mouseover');
    cy.get('p.note').should('be.visible').should('not.be.empty');
  });
});

describe('score page', () => {
  it('is reachable', () => {
    const search = "cow";
    const translit = /^ab$/;
    const ref = "(ED Animals A 1)";
    const score = "1";
    const title = "Source"; // should be Score?
    const score1 = "ab";
    cy.visit("/");
    cy.get('.search__input').type(search + "{enter}");
    cy.get('span.results__table-cell').contains(translit).click();
    // click the (86x/100%) link
    cy.get('.icount').should('be.visible').contains('%').click();
    cy.get('a').contains(ref).click();
    // Now we should have score links (line numbers in Text panel)
    cy.get('td.lnum a').contains(score).click();
    cy.get('.details__panel-top-text').contains(title);
    cy.get('a.cbd').contains(score1);
    // metadata panel should be empty, not "null" or anything
    cy.get('.details__panel-main').first().should('have.text', '');
  });
});
