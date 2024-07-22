class MockResponse {
  constructor(public body_fixture_path: string) {}
}

describe('Page', () => {
  let searches = [];
  let suggests = [];
  let oracc_calls = [];
  // These generic intercepts need to be declared before the generic
  // ones or they won't run.
  beforeEach(() => {
    cy.intercept('GET', '/search/*', (req) => {
      req.continue((res) => {
        searches.push([req['url'], req['query'], res]);
      });
    });
    cy.intercept('GET', '/suggest_all/*', (req) => {
      req.continue((res) => {
        suggests.push([req['url'], req['query'], res]);
      });
    });
    cy.intercept('GET', 'https://build-oracc.museum.upenn.edu/**', (req) => {
      req.continue((res) => {
        oracc_calls.push([req['url'], req['query'], res]);
      });
    });
  });
  beforeEach(() => {
    cy.fixture('directory.json').then((dir) => {
      // href2query2response[path][queryString] gives the response to href?queryString
      // queryString is normalized so that the portions in between the &s are sorted.
      let href2query2response = new Map<string, Map<string, MockResponse>>();
      Object.keys(dir).forEach((path) => {
        const url = new URL(dir[path]);
        const hpath = `${url.protocol}//${url.host}${url.pathname}`;
        // normalise the search params by sorting them
        url.searchParams.sort()
        const query = url.searchParams.toString();
        if (!href2query2response.has(hpath)) {
          href2query2response.set(hpath, new Map<string, MockResponse>());
        }
        href2query2response.get(hpath).set(query, new MockResponse(path));
      });
      href2query2response.forEach((mr_map, hpath) => {
        cy.intercept(hpath, (req) => {
          let params = Object.keys(req.query);
          params.sort();
          const qps = params.map((param) => `${param}=${req.query[param]}`);
          const query = qps.join("&");
          if (mr_map.has(query)) {
            req.reply({ fixture: mr_map.get(query).body_fixture_path });
          }
        });
      });
    });
  });
  after(() => {
    let directory = new Map<string, string>();
    const output_dir = 'cypress/fixtures_new';
    let count = 0;
    count += writeCapturedResponses(
      searches,
      output_dir,
      'backend',
      (path, url) => { directory.set(path, url); }
    );
    count += writeCapturedResponses(
      suggests,
      output_dir,
      'suggests',
      (path, url) => { directory.set(path, url); }
    );
    count += writeCapturedResponses(
      oracc_calls,
      output_dir,
      'oracc',
      (path, url) => { directory.set(path, url); }
    );
    if (0 < count) {
      cy.writeFile(`${output_dir}/directory.json`, Object.fromEntries(directory.entries()));
    }
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

// add_to_directory(path, url) is a callback for all the paths
// that have been written to.
function writeCapturedResponses(
  captured: any[],
  fixture_dir: string,
  name: string,
  add_to_directory: (path: string, url: string) => void
): number {
  let count = 0;
  captured.forEach(([url_string, query, res]) => {
    const loc: string = urlToFilePath(url_string, query, [name]);
    add_to_directory(loc, url_string);
    cy.writeFile(`${fixture_dir}/${loc}`, res['body']);
    ++count;
  });
  return count;
}

function urlToFilePath(url_string: any, query: any, initial: string[]) {
  const url = new URL(url_string);
  const params = Object.keys(query).sort();
  let qs = params.map((param) => `${param}=${query[param]}`);
  let path = url.pathname.split('/').slice(1); // initial '/' produces initial ''
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

