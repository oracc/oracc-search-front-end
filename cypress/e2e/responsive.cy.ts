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

  enum Direction { Ascending, Descending }

  function assert_column_is_sorted(
    selector: string,
    transform: (text : string) => any,
    pair_assertion: (previous : any, n : any) => any
) {
    let previous = null;
    cy.get(selector).each(
      ($li) => {
        const n = transform($li.text());
        expect(n).not.to.be.null;
        if (previous !== null) {
          pair_assertion(previous, n);
        }
        previous = n;
      }
    );
  }

  function assert_hits_column_is_sorted(dir: Direction) {
    assert_column_is_sorted(
      ".results__table .results__table-row-drop li:nth-of-type(2)",
      t => {
        const n = Number(t);
        expect(n).not.to.be.null;
        return n;
      },
      dir == Direction.Ascending?
      (previous, n) => {
        expect(n).to.be.at.least(previous);
      } : (previous, n) => {
        expect(n).to.be.at.most(previous);
      }
    );
  }

  function assert_cf_column_is_sorted(dir: Direction) {
    assert_column_is_sorted(
      ".results__table-row > .results__table-cell",
      t => t,
      dir == Direction.Ascending?
      (previous, n) => {
        assert(previous <= n);
      } : (previous, n) => {
        assert(n <= previous);
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
      assert_hits_column_is_sorted(Direction.Ascending);
      cy.get("#header-1").click();
      assert_sort_marker_index(1);
      assert_hits_column_is_sorted(Direction.Descending);
      portrait();
      // Check that we still have Hits column, and it's still sorted
      cy.get("#header-1").should("be.visible");
      assert_sort_marker_index(1);
      assert_hits_column_is_sorted(Direction.Descending);
      // Click on Ancient word column
      cy.get("#header-5").click();
      // and check that this is now the sorted column
      assert_sort_marker_index(5);
      assert_cf_column_is_sorted(Direction.Descending);
      // but that the Hits column is still visible
      cy.get("#header-1").should("be.visible");
    });

    it('works transitioning from portrait to landscape', () => {
      portrait();
      cy.visit("/");
      const search = "cow";
      const result = "abur";
      cy.get(".search__input").type(`${search}{enter}`);
      cy.get(".results__table-row").contains(result);
      // Ancient word (first) column (for some reason this is header-5)
      assert_sort_marker_index(5);
      // Open the column list
      cy.get("#header-0 .fa-list").click();
      // Now click on the "Hits" column
      cy.get("#header-1").should("be.visible").click();
      assert_sort_marker_index(1);
      // Let's check that the Hits column actually is sorted
      assert_hits_column_is_sorted(Direction.Ascending);
      cy.get("#header-1").click();
      assert_sort_marker_index(1);
      assert_hits_column_is_sorted(Direction.Descending);
      landscape();
      // Check that we still have Hits column, and it's still sorted
      cy.get("#header-1").should("be.visible");
      assert_sort_marker_index(1);
      assert_hits_column_is_sorted(Direction.Descending);
      // Click on Ancient word column
      cy.get("#header-5").click();
      // and check that this is now the sorted column
      assert_sort_marker_index(5);
      assert_cf_column_is_sorted(Direction.Descending);
      // but that the Hits column is still visible
      cy.get("#header-1").should("be.visible");
    });
  });
});
