// Method used for getting element path in non Chrome browsers
export function composedPath(el) {
  const path = [];

  while (el) {
    path.push(el);

    if (el.tagName === 'HTML') {
      path.push(document);
      path.push(window);

      return path;
    }

    el = el.parentElement;
  }

  return path;
}

// Turn location URL into breadcrumbs
export function getBreadcrumbs() {
  let path = "/";
  let result = [];
  for (let encoded_step of window.location.pathname.split('/')) {
    let step = decodeURI(encoded_step)
    if (result.length == 0) {
      if (step == "search") {
        result.push({ name: "Search", url: "/search" });
      }
    } else if (result.length == 1) {
      path = "/search/search-results";
      result.push({ name: "Search Results", url: path });
    } else {
      path += "/" + step;
      result.push({ name: decodeURI(step).replace('-', ' '), url: path });
    }
    if (result.length == 6) {
      result[5].data = history.state.data;
    }
  }
  if (window.innerWidth <= 991 && 1 < result.length) {
    result.shift();
  }
  return result;
}
