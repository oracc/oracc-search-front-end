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

export function getBreadcrumbs() {
  const url = window.location.pathname;
  const urlSegments = url.split('/').filter((segment) => segment !== ''); // Split URL and remove empty segments

  const breadcrumbs = [];
  let currentPath = '/';

  urlSegments.forEach((segment, index) => {
    // decode the name and path segments to display special characters correctly
    const decodedName = decodeURI(segment).replace('-', ' ');
    const decodedPath = decodeURI(segment);

    if (index === 0) return; // Skip the first segment since it is just the base URL

    currentPath += `${decodedPath}/`;

    breadcrumbs.push({
      name: decodedName,
      url: currentPath
    });
  });

  return breadcrumbs;
}
