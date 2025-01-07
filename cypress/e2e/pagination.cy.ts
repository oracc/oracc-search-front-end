import { oracc_stubs } from "cypress/e2e/oracc_stubs";

describe('Pagination', () => {
  oracc_stubs('pagination');

  describe('occurrences page', () => {
    it('paginates properly', () => {
      cy.visit("/");
      const search = "matu";
      const result = "land";
      const form = "133x/100%";
      const first_heading = "Larsa";
      const zoom_item = "unclear";
      const page_size = 25; // P4 provides pages of 25 elements
      const line_count = 133; // current number of items in the database
      const zoomed_line_count = 125;
      const next_page = 2;
      // this reference should be somewhere on the next_page of
      // the unzoomed list.
      const next_page_ref = "Esarhaddon 1 ii 52";
      const zoomed_next_page_ref = "Esarhaddon 1 v 30";
      const reset_filter_text = "Reset Filter";
      cy.get('.search__input').type(`${search}{enter}`);
      cy.get('.results__table-cell').contains(result).click();
      cy.get('.sense .icountu').contains(form).click();
      cy.get('#p4CElineContent .ce-result').should('have.length', page_size);
      cy.get('.details__panel-top-text.item-count').contains(line_count.toString());
      cy.get('.ce-heading').first().contains(first_heading);
      cy.get('.pgotl.level2 a').contains(zoom_item).click();
      //cy.get('.ce-heading').first().contains(zoom_item);
      cy.get('.details__panel-pagination .details__panel-list-item').should(
        'have.length',
        Math.ceil(zoomed_line_count / page_size)
      );
      cy.get('.details__panel-top-text.item-count').contains(zoomed_line_count.toString());
      cy.get('.details__panel-pagination .details__panel-list-item').contains(
        next_page.toString()
      ).click();
      // wait until we're definitely on the next page
      cy.get('#p4CElineContent .ce-label').contains(zoomed_next_page_ref);
      cy.get('.details__panel-top-text.item-count').contains(zoomed_line_count.toString());
      cy.get('.details__panel-top').contains(reset_filter_text);
      cy.get('.ce-heading').first().contains(zoom_item);
      cy.get('a.reset-zoom').click();
      cy.get('.ce-heading').contains(first_heading);
      cy.get('.ce-heading').first().contains(first_heading);
      // Check we are still on page 2. Is this what we want?
      cy.get('.details__panel-pagination .details__panel-list-item.active').contains(
        next_page.toString()
      );
      cy.get('.details__panel-top-text.item-count').contains(line_count.toString());
      cy.get('.details__panel-top').should('not.contain.text', reset_filter_text);
      // Are we really on the page we think we're on?
      cy.get('#p4CElineContent .ce-label').contains(next_page_ref);
    });
  });
});
