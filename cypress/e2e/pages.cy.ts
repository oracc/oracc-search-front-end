import { oracc_stubs } from "cypress/e2e/oracc_stubs";

describe('Pages', () => {
  function open_section(name) {
    cy.get('.hsheader').contains(name).click();
  }

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
    it('appears with mouseover', () => {
      cy.visit("/");
      const search = "king";
      const result = "šarrūtu";
      const form = "šarrūssin";
      const ref = "Tiglath-pileser III 47 o 4";
      const note = "p#n352.note";
      cy.get('.search__input').type(`${search}{enter}`);
      cy.get('.results__table-row').contains(result).click();
      open_section("Normalized forms");
      cy.get('.norms').contains(form).click();
      cy.get('.details__panel-main').contains(ref).click();

      cy.get(note).should('not.be.visible');
      cy.get('span.marker').first().trigger('mouseover');
      cy.get(note).should('be.visible').should('not.be.empty');
      cy.get(note).first().click();
      cy.get(note).should('not.be.visible');
    });

    // For some reason Cypress cannot simulate touch events of Firefox
    it('appears with touch tap', { browser: ["chrome", "chromium", "electron"] }, () => {
      cy.visit("/");
      const search = "king";
      const result = "šarrūtu";
      const form = "šarrūssin";
      const ref = "Tiglath-pileser III 47 o 4";
      const note = "p#n352.note";
      cy.get('.search__input').type(`${search}{enter}`);
      cy.get('.results__table-row').contains(result).click();
      open_section("Normalized forms");
      cy.get('.norms').contains(form).click();
      cy.get('.details__panel-main').contains(ref).click();

      cy.get('span.marker').first().trigger('touchstart');
      cy.get('span.marker').first().trigger('touchend');
      cy.get(note).should('be.visible').should('not.be.empty');
      cy.get(note).first().click();
      cy.get(note).should('not.be.visible');
    });
  });

  describe('passage selection', () => {
    it('keeps on screen and matched', () => {
      cy.visit("/");
      const search = "king";
      const result = "šarrūtu";
      const form = "šarrūssin";
      const ref = "Tiglath-pileser III 47 o 4";
      const translit_1 = '[id="Q003460.2"]';
      const translat_1 = '[id="Q003460_project-en.0"]';
      cy.get('.search__input').type(`${search}{enter}`);
      cy.get('.results__table-row').contains(result).click();
      open_section("Normalized forms");
      cy.get('.norms').contains(form).click();
      cy.get('.details__panel-main').contains(ref).click();

      // Check that the first elements are visible
      cy.get(translit_1).should('be.visible').should('have.class', 'selected');
      cy.get(translat_1).should('be.visible').parent().should('have.class', 'selected');
      // Now scroll the transliterations
      cy.get("#central-panel").first().scrollTo(0, 1200).wait(0).trigger("scrollend");
      // and check that the translations scroll into view and match
      cy.wait(600);
      cy.get("#central-panel tr.selected").should('have.length', 1).should('be.visible').then($e => {  
        cy.get("#right-panel tr.selected td").should(
          "have.id",
          $e.get()[0].getAttribute("data-tlat-ref"),
        );
      });
      // Now scroll the translations
      cy.get("#right-panel").first().scrollTo(0, -1000).wait(0).trigger("scrollend");
      // and check that the transliterations scroll into view and match
      cy.get("#central-panel tr.selected").should('have.length', 1).should('be.visible').then($e => {  
        cy.get("#right-panel tr.selected td").should(
          "have.id",
          $e.get()[0].getAttribute("data-tlat-ref"),
        );
      });
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
      const search = "Sidon";
      const result = "Ṣidunu";
      const ref1 = "Esarhaddon 1 iii 43";
      const ref2 = "Esarhaddon 2 ii 1";
      const ref3 = "Esarhaddon 3 ii 16'";
      cy.get('.search__input').type(search);
      cy.get('.suggestion').contains(search).click();
      cy.get('.results__table-row').contains(result).click();
      cy.get('#periods .icountu').click();
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
      const search = "harness";
      const translit = /^ur$/;
      const ref = "ED Animals A 1";
      const score = "1";
      const title = "Score";
      const score1 = "ab";
      cy.visit("/");
      cy.get('.search__input').type(search + "{enter}");
      cy.get('span.results__table-cell').contains(translit).click();
      // click the (86x/100%) link
      cy.get('.icountu').should('be.visible').contains('%').click();
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
