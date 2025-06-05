import { oracc_stubs } from "cypress/e2e/oracc_stubs";

const configs = [{
  name: 'desktop',
  is_mobile: false,
  viewport: {width: 1280, height: 700}
}, {
  name: 'mobile',
  is_mobile: true,
  viewport: {width: 600, height: 1000}
}];

describe('Journey', () => {
  oracc_stubs('journey');

  for (const config of configs) {
    describe(`${config.name}:`, () => {
      // we need beforeEach not before because failing tests
      // can mess with the viewport for some reason.
      beforeEach(() => {
        cy.log(`Configuration: ${JSON.stringify(config)}`);
        const vp = config.viewport;
        cy.viewport(vp.width, vp.height);
      });
      describe(`search process component journey`, () => {
        it('shows the correct pages', () => {
          const search = "wat";
          const suggestion = "water";
          const result = "nagbu";
          const form = "nagab";
          const ref = "Sennacherib 42 6";
          const translation = " father of the gods, looked steadfastly upon me among all of the rulers";
          // part of the transliteration that matches this translation
          const transliteration = "ma-li-ki";

          cy.visit("/");
          // do a search for "water" and check suggestions show
          cy.get('.search__input').type(search);
          cy.get('.suggestions-content').should('be.visible');
          cy.get('.suggestion').contains(suggestion).click();

          // check water results table displays and click `result`
          cy.get('.results').should('be.visible');
          cy.get('.bcrumbs').should('be.visible');
          cy.get('.results__table-cell').contains(result).click();

          // expect details
          cy.get('.glossary').should('be.visible');
          cy.get('.norms').should('be.visible');
          cy.get('.norms').contains(form).click();

          // check breadcrumbs show the correct level of traceback and detail page shown
          cy.get('.bcrumbs').should('be.visible');
          cy.get('.bcrumbs__list-item').contains('occurrences').should('be.visible');
          cy.get('.details').should('be.visible');

          // check clicking on an entry reveals the translation and changes the main column to that entry
          cy.get('.ce-label').contains(ref).click();
          if (config.is_mobile) {
            // open the translation panel
            cy.get('.text-expand').click();
          }
          cy.contains(translation).should('be.visible').click();
          // now the transliteration corresponding to this translation should be .selected
          // and visible
          const translit_element = cy.get('.selected').contains(transliteration).should('be.visible');

          // check clicking the "original" text (not translation) goes on to provide details for that word
          translit_element.click();
          cy.get('.bcrumbs').should('be.visible');
          const breadcrumb1 = result.replaceAll('-', '');
          cy.get('.bcrumbs__list-item').contains(breadcrumb1).should('be.visible');
          const breadcrumb2 = transliteration.replaceAll('-', ' ');
          cy.get('.bcrumbs__list-item').contains(breadcrumb2).should('be.visible');
          cy.get('.norms').should('be.visible');

          // check breadcrumbs work in a deep search
          cy.get('.bcrumbs__list-item').contains('texts').click();
          cy.get('.details').should('be.visible');
        });

        it('is navigable via breadcrumbs', () => {
          const input = "water";
          const result = "abzu";
          const form = "ab-su";
          const ref = "VAT 607+ (VS 2, 11) (+) AO 3924 (TCL 15, pl.3) o ii 7'";
          const transliteration_word = "ab-su-ra";
          const expected_form = "ab-su-a";
          cy.visit("/");
          check_page_is_search(config);
          cy.get('.search__input').type(`${input}{enter}`);
          check_page_is_search_results();
          cy.get('span.results__table-cell').contains(result).click();
          check_page_is_search_result();
          cy.get('p.norms span').contains(form).click();
          check_page_is_details();
          cy.get('.details__panel-main').contains(ref).click();
          check_page_is_details_texts();
          cy.get('table.transliteration tr.l a.cbd').contains(transliteration_word).click();
          check_page_is_glossary_article_texts();
          cy.get('#p4GlossaryEntry').contains(expected_form);
          cy.get('ul.bcrumbs__list li:nth-of-type(5)').click();
          check_page_is_details_texts();
          cy.get('table.transliteration tr.l a.cbd').contains(transliteration_word);
          cy.get('ul.bcrumbs__list li:nth-of-type(4)').click();
          check_page_is_details();
          cy.get('.details__panel-main').contains(ref);
          cy.get('ul.bcrumbs__list li:nth-of-type(3)').click();
          check_page_is_search_result();
          cy.get('p.norms span').contains(form);
          cy.get('ul.bcrumbs__list li:nth-of-type(2)').click();
          check_page_is_search_results();
          cy.get('span.results__table-cell').contains(result);
          cy.get('ul.bcrumbs__list li:nth-of-type(1)').click();
          check_page_is_search(config);
        });
      });

      it('can get to occurences/tests/score', () => {
        const input = "cow";
        const result = "ab";
        const meaning = "harness"
        const ref = "(ED Animals A 1)";
        const score = "ur₃";
        cy.visit("/");
        check_page_is_search(config);
        cy.get('.search__input').type(`${input}{enter}`);
        check_page_is_search_results();
        cy.get('span.results__table-cell').contains(result).click();
        check_page_is_search_result();
        cy.get('.lex-phra').contains(meaning).click();
        check_page_is_details();
        cy.get('.details__panel-main').contains(ref).click();
        check_page_is_details_texts();
        cy.get('.details__panel-main tr.l .lnum').contains("1").click();
        check_page_is_details_score();
        cy.get('table.score_block tr.l td.tlit a').contains(score).click();
        check_page_is_glossary_article_score(score);
        cy.get('.senses').contains("/100%)");
      });

      it('can get to project texts', () => {
        const input = "cow";
        const result = "ab";
        const ref = "(ED Animals A 1)";
        const meaning = "harness"
        const score = "3";
        const text = "SF 081 o i 3";
        cy.visit("/");
        check_page_is_search(config);
        cy.get('.search__input').type(`${input}{enter}`);
        check_page_is_search_results();
        cy.get('span.results__table-cell').contains(result).click();
        check_page_is_search_result();
        cy.get('.lex-phra').contains(meaning).click();
        check_page_is_details();
        cy.get('.details__panel-main').contains(ref).click();
        check_page_is_details_texts();
        cy.get('.details__panel-main a[data-bloc] .xlabel').contains(score).click();
        check_page_is_details_score();
        if (config.is_mobile) {
          // open the details panel
          cy.get('.text-expand').click();
        }
        cy.get('.score_block tr').contains(text).click();
        check_page_is_project_texts();
        cy.get('ul.bcrumbs__list li:nth-of-type(6)').click();
        check_page_is_details_score();
        if (config.is_mobile) {
          cy.get('.text-expand').click();
        }
        cy.get('.score_block tr').contains(text);
      });

      it('can navigate back to result after switching to occurences text', () => {
        const input = "water";
        const result = "abzu";
        const form = "ab-su";
        const ref = "VAT 607+ (VS 2, 11) (+) AO 3924 (TCL 15, pl.3) o ii 7'";
        const transliteration_word = "ab-su-ra";
        const expected_form = "ab-su-a";
        const expected_ref = "(VAT 1338 + VAT 1348 + VAT 1406 + 2164 + VAT 3702 o ii 18)";
        cy.visit("/");
        check_page_is_search(config);
        cy.get('.search__input').type(`${input}{enter}`);
        check_page_is_search_results();
        cy.get('span.results__table-cell').contains(result).click();
        check_page_is_search_result();
        cy.get('p.norms span').contains(form).click();
        check_page_is_details();
        cy.get('.details__panel-main').contains(ref).click();
        check_page_is_details_texts();
        cy.get('table.transliteration tr.l a.cbd').contains(transliteration_word).click();
        check_page_is_glossary_article_texts();
        cy.get('#p4GlossaryEntry').contains(expected_form).click();
        cy.get('.ce-label').contains(expected_ref);
        cy.get('ul.bcrumbs__list li:nth-of-type(3)').click();
        check_page_is_search_result();
        cy.get('p.norms span').contains(form);
      });

      describe('search results page', () => {
        describe('type of result', () => {
          it('shows morphological form', () => {
            const input = "eden";
            const result = "plain";
            const form = "~,ak";
            cy.visit("/");
            cy.get('.search__input').type(`${input}{enter}`);
            cy.get('.results__table-cell').contains(result).click();
            cy.get('div.morphs .icountu').contains(form).click();
            cy.get('div.title-word').contains(`${input} [${result}] morphology: ${form}`);
          });
        });

        describe('lexical association', () => {
          it('goes to the correct next page', () => {
            const input = "eden";
            const result = "plain";
            const lexphra = "qatnu[thin]AJ";
            const text = "LTBA 1, 40 o iii 45'";
            cy.visit("/");
            cy.get('.search__input').type(`${input}{enter}`);
            cy.get('.results__table-cell').contains(result).click();
            cy.get('#lexphrases h2.lex-phra').contains(lexphra).click();
            cy.get('#p4CElineContent .ce-label').contains(text);
          });

          it('text jumps forward two pages', () => {
            const input = "eden";
            const result = "plain";
            const text = "LTBA 1, 40 o iii 45'";
            const textTitle = "LTBA 1, 40";
            cy.visit("/");
            cy.get('.search__input').type(`${input}{enter}`);
            cy.get('.results__table-cell').contains(result).click();
            cy.get('#lexphrases .lex-line').contains(text).click();
            check_page_is_details_texts();
            cy.get('.p3h2').contains(textTitle);
            cy.get('.bcrumbs__list .bcrumbs__list-item').contains('occurrences').click();
            check_page_is_details();
            cy.get('#p4CElineContent .ce-label').contains(text);
          });
        });
      });

      describe('search suggestion box', () => {
        it('is navigable with up and down arrow keys', () => {
          const search = "wa";
          const suggestion = "water";
          const recurse_limit = 50;
          cy.visit("/");
          cy.get('.search__input').type(search);
          cy.get('.suggestion').should('be.visible');
          cy.get('.search__input').type('{downArrow}');
          // we have to recurse for this to interlace with Cypress properly
          const down_to_suggestion = (limit) => {
            if (limit == 0) {
              return;
            }
            cy.focused().then(($sugg) => {
              if ($sugg.text().trim() == suggestion) {
                return;
              }
              cy.wrap($sugg).type('{downArrow}');
              down_to_suggestion(limit - 1);
            });
          };
          down_to_suggestion(recurse_limit);
          cy.focused().contains(suggestion);
          cy.focused().type('{upArrow}');
          cy.focused().contains(suggestion).should('not.exist');
          cy.focused().type('{downArrow}');
          cy.focused().contains(suggestion);
        });
      });
    });
  }
});

// First page: search.component
function check_page_is_search(config) {
  if (!config.is_mobile) {
    cy.get('.search__title').contains('Search Oracc').should('be.visible');
  }
  cy.get('input.search__input').should('be.visible');
  cy.get('app-search div.search__content div.search__form').next().next().should("not.exist");
}

// Second page: search-results.component
function check_page_is_search_results() {
  cy.get('section.results');
}

// Third page: search.component
function check_page_is_search_result() {
  cy.get('div.glossary-article');
}

// Fourth page: details.component
function check_page_is_details() {
  cy.get('section.details--main');
  cy.get('.details__panel-top-text').contains('Reference');
  checkSelectedWordIsHighlighted();
}

// Fifth page: details-texts.component
function check_page_is_details_texts() {
  cy.get('section.details');
  cy.get('.details__panel-top-text').contains('Text');
  checkSelectedWordIsHighlighted();
}

// Alternate fifth page: details-score.component
function check_page_is_details_score() {
  cy.get('section.details--score');
}

// Sixth page: glossary-article-texts.component
function check_page_is_glossary_article_texts() {
  cy.location().should(loc => {
    expect(loc.pathname).to.contain('occurrences/texts/');
    expect(loc.pathname).not.to.contain('texts/score/');
  });
}

// Alternate sixth page: glossary-article-score.component
function check_page_is_glossary_article_score(score) {
  cy.location().should(loc => {
    expect(loc.pathname).to.contain(`texts/score/${encodeURIComponent(score)}`);
  });
}

// Seventh page: project-texts.component
function check_page_is_project_texts() {
  // Don't have a way to differentiate between project-texts and
  // glossary-article-texts at the moment
  cy.get('section.details');
  cy.get('.details__panel-top-text').contains('Text');
}

function checkSelectedWordIsHighlighted(){
  cy.get('span.selected').should('be.visible').then(($selected) => {
  // if ($selected.hasClass('sux')) {
  //   // If the 'span.selected' has the '.sux' class, it should be the highlight
  //   expect($selected).to.have.css('background-color', 'rgba(236, 200, 53, 0.827)');
  // } else {
  //    // If the 'span.selected' doesn't have '.sux', check for blueSky
  //   expect($selected).to.have.css('background-color', 'rgb(223, 238, 247)');
  // }
  if ($selected.parents('table.transliteration').length) {
    // If the 'span.selected' is within a 'table.transliteration', check for yellow
    expect($selected).to.have.css('background-color', 'rgba(236, 200, 53, 0.827)');
  } else if ($selected.parents('.ce-result').length) {
    // If the 'span.selected' is within a '.ce-result', check for blue
    expect($selected).to.have.css('background-color', 'rgb(223, 238, 247)');
  }
});
}