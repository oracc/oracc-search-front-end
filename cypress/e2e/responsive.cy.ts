import { oracc_stubs } from "cypress/e2e/oracc_stubs";

describe('Responsive', () => {
  oracc_stubs('responsive');

  function portrait() {
    cy.viewport(550, 1300);
  }

  function landscape() {
    cy.viewport(1300, 550);
  }

  function assert_sort_marker_index(column: number) {
    for (let i = 0; i !== 6; ++i) {
      cy.get(`#header-${i} .fa-sort-down`).should(`${i == column? "" : "not."}be.visible`);
    }
  }

  function assert_column_is_sorted_numbers(column: number) {
    let previous = null;
    cy.get(`.results__table .results__table-row-drop li:nth-of-type(${column})`).each(
      ($li) => {
        const n = Number($li.text());
        expect(n).not.to.be.null;
        if (previous !== null) {
          expect(n).to.be.at.least(previous);
        }
        previous = n;
      }
    );
  }

  describe('search result page', () => {
    it('works transitioning from landscape to portrait', () => {
      landscape();
      cy.visit("/");
      const search = "cow";
      const result = "abur";
      cy.get(".search__input").type(`${search}{enter}`);
      cy.get(".results__table-row").contains(result);
      // Ancient word (first) column (for some reason this is header-5)
      assert_sort_marker_index(5);
      // Now click on the "Hits" column
      cy.get("#header-1").click();
      assert_sort_marker_index(1);
      // Let's check that the Hits column actually is sorted
      assert_column_is_sorted_numbers(2);
      portrait();
      // Check that we still have Hits column, and it's still sorted
      cy.get("#header-1").should("be.visible");
      assert_column_is_sorted_numbers(2);
      // Click on Ancient word column
      //...
      // and check that this is now the sorted column
      //...
      // but that the Hits column is still visible
      cy.get("#header-1").should("be.visible");
    });
  });
});
