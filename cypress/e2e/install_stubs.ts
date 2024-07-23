import { CyHttpMessages, RouteMatcher, RouteMatcherOptionsGeneric } from "cypress/types/net-stubbing";

type InterceptData = {
  response: CyHttpMessages.IncomingHttpResponse;
  routeMatcher: RouteMatcher;
}

export function install_stubs(
  stubs: { searches: string; suggests: string; oracc: string; },
  directory_name: string
) {
  // List of captured interepts that aren't already stubbed
  let new_intercepts = new Map<string, InterceptData[]>(
    Object.keys(stubs).map(name => [name, new Array()])
  );
  // These generic intercepts need to be declared before the generic
  // ones or they won't run.
  beforeEach(() => {
    new_intercepts.forEach((intercepts, name) => {
      cy.intercept("GET", stubs[name], (req) => {
        req.continue((res) => {
          intercepts.push(interceptData(req, res));
        });
      });
    });
  });
  // Install all the stubs gathered from a previous run
  beforeEach(() => {
    cy.fixture(`${directory_name}.json`).then((dir) => {
      Object.keys(dir).forEach((fixture_path) => {
        cy.intercept(dir[fixture_path], (req) => {
          req.reply({ fixture: fixture_path });
        });
      });
    });
  });
  after(() => {
    const output_dir = 'cypress/fixtures_new';
    let all_entries = new Map<string, RouteMatcher>();
    new_intercepts.forEach((intercept_data, name) => {
      const new_entries = writeCapturedResponses(
        intercept_data,
        output_dir,
        name
      );
      all_entries = { ...all_entries, ...new_entries };
    });
    const entry_count = Object.keys(all_entries).length;
    if (0 < entry_count) {
      cy.writeFile(`${output_dir}/${directory_name}.json`, all_entries);
      cy.log(`written ${entry_count} entries`);
    } else {
      cy.log('All calls were stubbed');
    }
  });
}

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
  const steps = initial.concat(path, qs, [name]).map(encodeURIComponent);
  const loc = steps.join('/');
  return loc;
}
