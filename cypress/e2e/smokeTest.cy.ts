const oraccUrl = 'http://localhost:4200';
describe('home page', () => {
  it('is the search page', () => {
    cy.visit(oraccUrl);

    check_page_is_search();

    // cy.get('.cookies').should('be.visible'); // not applicable to local

    cy.get('.footer').should('be.visible');
    cy.get('.header').should('be.visible');
  });
});

describe('search process component journey', () => {
  it('shows the correct pages', () => {
    cy.visit(oraccUrl);
    // do a search for "water" and check suggestions show
    cy.get('.search__input').type('water');
    cy.get('.suggestions-content').should('be.visible');
    cy.get('.suggestion').contains('water');
    cy.get('.search__input').type('{enter}');

    // check water results table displays and click bail (first result)
    cy.get('.results').should('be.visible');
    cy.get('.bcrumbs').should('be.visible');
    cy.get('li.results__table-cell').contains('bail').click();

    // expect details of a bal
    cy.get('.glossary').should('be.visible');
    cy.get('.norms').should('be.visible');
    cy.get('.norms').contains('a bal').click();

    // check breadcrumbs show the correct level of traceback and detail page shown
    cy.get('.bcrumbs').should('be.visible');
    cy.get('.bcrumbs__list-item').contains('occurrences').should('be.visible');
    cy.get('.details').should('be.visible');

    // check clicking on an entry reveals the translation and changes the main column to that entry
    cy.get('.ce-label').contains('NABU').click();
    cy.contains('good "neck and jaw" barley').should('be.visible');
    cy.contains('NABU 2017/40').should('be.visible');

    // check clicking the "original" text (not translation) goes on to provide details for that word
    cy.contains('ama').click();
    cy.get('.bcrumbs').should('be.visible');
    cy.get('.bcrumbs__list-item').contains('ama').should('be.visible');
    cy.get('.norms').should('be.visible');

    // check breadcrumbs work in a deep search
    cy.get('.bcrumbs__list-item').contains('texts').click();
    cy.get('.details').should('be.visible'); // if this passes then the breadcrumb issue is fixed
  });
  it('is navigable via breadcrumbs', () => {
    cy.visit(oraccUrl);
    check_page_is_search();
    cy.get('.search__input').type('water{enter}');
    check_page_is_search_results();
    cy.get('span.results__table-cell').contains('ugu').click();
    check_page_is_search_result();
    cy.get('p.norms span.sux').contains('ugu').click();
    check_page_is_details();
    cy.get('.details__panel-main').contains('KUB 03, 103 r 6').click();
    check_page_is_details_texts();
    cy.get('table.transliteration tr.l a.cbd span.sux').contains('er').click();
    check_page_is_glossary_article_texts();
    cy.get('ul.bcrumbs__list li:nth-of-type(5)').click();
    check_page_is_details_texts();
    cy.get('ul.bcrumbs__list li:nth-of-type(4)').click();
    check_page_is_details();
    cy.get('ul.bcrumbs__list li:nth-of-type(3)').click();
    check_page_is_search_result();
    cy.get('ul.bcrumbs__list li:nth-of-type(2)').click();
    check_page_is_search_results();
    cy.get('ul.bcrumbs__list li:nth-of-type(1)').click();
    check_page_is_search();
  });
});

describe('footnote popup', () => {
  it('works properly', () => {
    cy.visit(oraccUrl);
    cy.get('.search__input').type('watering place {enter}');
    cy.contains('ugu').click();
    cy.get('span.sux').eq(1).click();
    cy.contains('(KUB 03, 103 r 6)').click();

    cy.get('span.marker').first().click();
    cy.get('p.note').should('be.visible').should('not.be.empty');
  });
});

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
