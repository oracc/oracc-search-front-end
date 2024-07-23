import { CyHttpMessages, RouteMatcher, RouteMatcherOptionsGeneric } from "cypress/types/net-stubbing";

class MockResponse {
  constructor(public body_fixture_path: string) {}
}

type InterceptData = {
  response: CyHttpMessages.IncomingHttpResponse;
  routeMatcher: RouteMatcher;
}

describe('Page', () => {
  let searches: InterceptData[] = [];
  let suggests: InterceptData[] = [];
  let oracc_calls: InterceptData[] = [];
  // These generic intercepts need to be declared before the generic
  // ones or they won't run.
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/search/*', (req) => {
      req.continue((res) => {
        searches.push(interceptData(req, res));
      });
    });
    cy.intercept('GET', 'http://localhost:8000/suggest_all/*', (req) => {
      req.continue((res) => {
        suggests.push(interceptData(req, res));
      });
    });
    cy.intercept('GET', 'https://build-oracc.museum.upenn.edu/**', (req) => {
      req.continue((res) => {
        oracc_calls.push(interceptData(req, res));
      });
    });
  });
  beforeEach(() => {
    cy.fixture('directory.json').then((dir) => {
      Object.keys(dir).forEach((fixture_path) => {
        cy.intercept(dir[fixture_path], (req) => {
          req.reply({ fixture: fixture_path });
        });
      });
    });
  });
  after(() => {
    const output_dir = 'cypress/fixtures_new';
    const searches_dir = writeCapturedResponses(
      searches,
      output_dir,
      'backend'
    );
    const suggests_dir = writeCapturedResponses(
      suggests,
      output_dir,
      'suggests'
    );
    const oracc_dir = writeCapturedResponses(
      oracc_calls,
      output_dir,
      'oracc'
    );
    cy.writeFile(`${output_dir}/directory.json`, {
      ...searches_dir,
      ...suggests_dir,
      ...oracc_dir
    });
  });

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
});

function interceptData(
  req: CyHttpMessages.IncomingHttpRequest,
  res: CyHttpMessages.IncomingHttpResponse
): InterceptData {
  const url = new URL(req.url);
  return {
    response: res,
    routeMatcher: {
      hostname: url.hostname,
      pathname: url.pathname,
      query: Object.fromEntries(url.searchParams.entries())
    }
  };
}

function writeCapturedResponses(
  captured: InterceptData[],
  fixture_dir: string,
  name: string
): Map<string, RouteMatcher> {
  let r = new Map<string, RouteMatcher>();
  captured.forEach((intercept_data) => {
    const loc: string = urlToFilePath(
      (intercept_data.routeMatcher as RouteMatcherOptionsGeneric<string>).pathname,
      (intercept_data.routeMatcher as RouteMatcherOptionsGeneric<string>).query,
      [name]
    );
    cy.writeFile(`${fixture_dir}/${loc}`, intercept_data.response.body);
    r[loc] = intercept_data.routeMatcher;
  });
  return r;
}

function urlToFilePath(pathname: string, query: any, initial: string[]) {
  const params = Object.keys(query).sort();
  let qs = params.map((param) => `${param}=${query[param]}`);
  let path = pathname.split('/').slice(1); // initial '/' produces initial ''
  let name = 'index';
  if (path.length) {
    name = path.pop();
  } else if (qs.length) {
    name = qs.pop();
  }
  const steps = initial.concat(path, qs, [name]);
  const loc = steps.join('/');
  return loc;
}

