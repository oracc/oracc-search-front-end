// Find ancestor that matches `filterBy`. Returns false if there isn't one.
export function findAncestorBy(
  element: HTMLElement,
  filterBy: (e : Element) => boolean
) : HTMLElement | null {
  while (element) {
    if (filterBy(element)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

// Find ancestor with a particular tag. Returns false if there isn't one.
export function findAncestorByTag(element: HTMLElement, tag: string) : HTMLElement | null {
  tag = tag.toUpperCase();
  return findAncestorBy(element, e => e.tagName == tag);
}

// Returns the ancestor of `element` that has the specified attribute.
// Returns null if there is no ancestor with this attribute.
export function findAncestorWithAttribute(element: HTMLElement, attrName: string) : HTMLElement | null {
  return findAncestorBy(element, e => e.hasAttribute(attrName));
}

// Find ancestor with a particular attribute that filterBy also returns true for.
// Returns the value of this attribute of this element.
// Returns null if there is no such element.
export function findAttributeBy(element: Element, attrName: string, filterBy: (e : Element) => boolean) : string | null {
  while (element) {
    if (filterBy(element) && element.hasAttribute(attrName)) {
      return element.getAttribute(attrName);
    }
    element = element.parentElement;
  }
  return null;
}

// Find ancestor with a particular attribute.
// Returns the value of this attribute of this element.
// Returns null if there is no such element.
export function findAttribute(element: Element, attrName: string) : string | null {
  return findAttributeBy(element, attrName, (e) => true);
}

// Find ancestor that has the specified tag and an attrName attribute.
// Returns the value of this attribute of this element.
// Returns null if there is no such element.
export function findAttributeOnTag(element: Element, attrName: string, tag: string) : string | null {
  tag = tag.toUpperCase();
  return findAttributeBy(element, attrName, (e) => e.tagName == tag);
}

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

// Removes TD elements that match the class named in extractClass.
// Returns the extracted nodes put into a copy of node (but without the
// non-extracted TD elements). Node has its TD elements with the
// matching class removed.
function splitOutColumnByClass(node: Node, extractClass: string) : Node {
  if (!node) {
    return null;
  }
  if (node.nodeName == "TD") {
    let el = node as Element;
    if (el.classList.contains(extractClass)) {
      // move this node into the "translations" return value
      return node.parentNode.removeChild(node);
    } else {
      // leave it where it is
      return null;
    }
  }
  // Not a TD, so must be in both. Shallow clone it for the
  // translations node and fill it with splits of all the child nodes.
  let extracted = node.cloneNode(false);
  node.childNodes.forEach(child => {
    let extr = splitOutColumnByClass(child, extractClass);
    if (extr) {
      extracted.appendChild(extr);
    }
  });
  return extracted;
}

// Removes td.xtr elements from node.
// Returns a clone of node that has all td elements that do not
// match .xtr removed.
export function splitOutTranslations(node: Element) : Element {
  return splitOutColumnByClass(node, 'xtr') as Element;
}

// Removes td.enum elements from node.
// Returns a clone of node that has all td elements that do not
// match .enum removed.
export function splitOutEnums(node: Element) : Element {
  return splitOutColumnByClass(node, 'enum') as Element;
}

// Returns the index at which the predicate is true, or null
// if the predicate is false for all the elements in the collection.
export function findInCollection(collection: HTMLCollection, predicate: (Element) => boolean) {
  for (let i = 0; i < collection.length; ++i) {
    if (predicate(collection[i])) {
      return i;
    }
  }
  return null;
}

// add k: e.getAttribute(v) to params for the first element that has
// such an attribute.
function addParam(params, elements, k, v) {
  for (let e of elements) {
    if (e.hasAttribute(v)) {
      params[k] = e.getAttribute(v);
      return;
    }
  }
}

// Adds elements to params based on the attributes of elements.
// for each item (k, v) in dict, find the first (if any) of elements
// that has v as an attribute and if so adds k: e.getAttribute(v)
// to params.
// Ignores nulls in the elements list.
export function addParams(params, elements, dict) {
  const es = elements.filter(e => e);
  for (let k in dict) {
    const v = dict[k];
    addParam(params, elements, k, v);
  }
}

// Adds gw (guideword) and pos (part of speech) to params
// if #p4Article is in the document and has the associated
// attributes.
export function addArticleParams(params) {
  const article = document.getElementById('p4Article')
  if (!article) {
    return;
  }
  if (article.hasAttribute('data-gw')) {
    params['gw'] = article.getAttribute('data-gw');
  }
  if (article.hasAttribute('data-pos')) {
    params['pos'] = article.getAttribute('data-pos');
  }
}

export function mergeParams(base, queryParams, keys) {
  console.log(queryParams);
  for (let key of keys) {
    if (key in queryParams) {
      base[key] = queryParams[key];
    } else {
      console.log(`no key ${key}`);
    }
  }
  console.log(base);
  return base;
}
