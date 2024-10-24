import { oracc_stubs } from "cypress/e2e/oracc_stubs";

describe('Pages', () => {
  oracc_stubs('pages');

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
      const result = "Abdi-Li\u02beti";
      const ref = "Sennacherib 4 36";
      cy.get('.search__input').type(search);
      cy.get('.suggestion').contains(search).click();
      cy.get('.results__table-row').contains(result).click();
      cy.get('.forms .icountu').click();
      cy.get('.details__panel-main').contains(ref).click();

      // mouse activation of popups
      cy.get('p.note').should('not.be.visible');
      cy.get('span.marker').first().trigger('mouseover');
      cy.get('p.note').should('be.visible').should('not.be.empty');
      cy.get('span.marker').first().trigger('mouseout');
      cy.get('p.note').should('not.be.visible');

      // mobile activation of popups
      cy.get('span.marker').first().trigger('touchstart');
      cy.get('span.marker').first().trigger('touchend');
      cy.get('p.note').should('be.visible').should('not.be.empty');
      cy.get('p.note').first().click();
      cy.get('p.note').should('not.be.visible');
    });
  });

  function heading_of_ref(ref: string) {
    const [text, volume] = ref.split(" ", 2);
    const vol = Number(volume);
    const rendered = Intl.NumberFormat('en', {
      minimumIntegerDigits: 3,
      useGrouping: false
    }).format(vol);
    return `${text} ${rendered}`;
  }

  describe('occurrences texts', () => {
    it('can be navigated between', () => {
      cy.visit("/");
      const search = "king";
      const result = "Abdi-Li\u02beti";
      const ref1 = "Sennacherib 4 36";
      const ref2 = "Sennacherib 16 iii 17";
      const ref3 = "Sennacherib 17 ii 77";
      cy.get('.search__input').type(search);
      cy.get('.suggestion').contains(search).click();
      cy.get('.results__table-row').contains(result).click();
      cy.get('.forms .icountu').click();
      cy.get('.details__panel-main').contains(ref3);
      cy.get('.details__panel-main').contains(ref2);
      cy.get('.details__panel-main').contains(ref1).click();
      cy.get('#central-panel .heading').should('have.text', heading_of_ref(ref1));
      cy.get('.item-nav.fa-arrow-right').click();
      cy.get('#central-panel .heading').should('have.text', heading_of_ref(ref2));
      cy.get('.item-nav.fa-arrow-right').click();
      cy.get('#central-panel .heading').should('have.text', heading_of_ref(ref3));
      cy.get('.item-nav.fa-arrow-left').click();
      cy.get('#central-panel .heading').should('have.text', heading_of_ref(ref2));
      cy.get('.item-nav.fa-arrow-left').click();
      cy.get('#central-panel .heading').should('have.text', heading_of_ref(ref1));
      cy.get('.item-nav.fa-arrow-left').should('not.be.visible');
    });
  });

  describe('score page', () => {
    it('is reachable', () => {
      const search = "cow";
      const translit = /^ab$/;
      const ref = "(ED Animals A 1)";
      const score = "1";
      const title = "Score";
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
});
