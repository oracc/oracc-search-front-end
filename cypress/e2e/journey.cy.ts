const configs = [{
  name: 'desktop',
  is_mobile: false,
  viewport: {width: 1280, height: 700}
}, {
  name: 'mobile',
  is_mobile: true,
  viewport: {width: 600, height: 1000}
}];

for (const config of configs) {
  describe(`${config.name}:`, () => {
    before(() => {
      cy.log(`Configuration: ${JSON.stringify(config)}`);
      const vp = config.viewport;
      cy.viewport(vp.width, vp.height);
      cy.intercept('GET', '/search/*', (req) => {
        console.log(JSON.stringify(req));
        req.continue((res) => {
          console.log(JSON.stringify(res));
        });
      });
    });
    describe(`search process component journey`, () => {
      it('shows the correct pages', () => {
        const search = "wat";
        const suggestion = "water";
        const result = "zebu";
        const form = "ab-za-za";
        const ref = "NFT 204-206 (AO 4328 (+) 4330) o i 2";
        const translation = "the enemy has a furious heart";
        // part of the transliteration that matches this translation
        const transliteration = "mu-sa-re";

        cy.visit("/");
        // do a search for "water" and check suggestions show
        cy.get('.search__input').type(search);
        cy.get('.suggestions-content').should('be.visible');
        cy.get('.suggestion').contains(suggestion).click();

        // check water results table displays and click `result`
        cy.get('.results').should('be.visible');
        cy.get('.bcrumbs').should('be.visible');
        cy.get('li.results__table-cell').contains(result).click();

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
        const breadcrumb1 = form.replaceAll('-', '');
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
        const result = "abala";
        const form = "a-bala";
        const ref = "CBS 3656 o 25";
        const transliteration_word = "gada";
        const expected_form = "gada,gin";
        cy.visit("/");
        check_page_is_search();
        cy.get('.search__input').type(`${input}{enter}`);
        check_page_is_search_results();
        cy.get('span.results__table-cell').contains(result).click();
        check_page_is_search_result();
        cy.get('p.norms span').contains(form).click();
        check_page_is_details();
        cy.get('.details__panel-main').contains(ref).click();
        check_page_is_details_texts();
        cy.get('table.transliteration tr.l a.cbd span').contains(transliteration_word).click();
        check_page_is_glossary_article_texts();
        cy.get('#p4GlossaryEntry').contains(expected_form);
        cy.get('ul.bcrumbs__list li:nth-of-type(5)').click();
        check_page_is_details_texts();
        cy.get('table.transliteration tr.l a.cbd span').contains(transliteration_word);
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
        check_page_is_search();
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

// First page: search.component
function check_page_is_search() {
  cy.get('.search__title').contains('Search Oracc').should('be.visible');
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
}

// Fifth page: details-texts.component
function check_page_is_details_texts() {
  cy.get('section.details--texts');
}

// Sixth page: glossary-article-texts.component
function check_page_is_glossary_article_texts() {
  cy.get('div.glossary-article-text');
}
