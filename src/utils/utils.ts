// Find ancestor with a particular tag. Returns false if there isn't one.
export function findAncestorByTag(element: HTMLElement, tag: string) : HTMLElement | null {
  tag = tag.toUpperCase();
  while (element) {
    if (element.tagName == tag) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
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

// Removes td.t1.xtr elements from node.
// Returns a clone of node that has all td elements that do not
// match .t1.xtr removed.
function splitOutTranslationsNode(node: Node) : Node {
  if (!node) {
    return null;
  }
  if (node.nodeName == "TD") {
    let el = node as Element;
    if (el.classList.contains('t1') && el.classList.contains('xtr')) {
      // move this node into the "translations" return value
      return node.parentNode.removeChild(node);
    } else {
      // leave it where it is
      return null;
    }
  }
  // Not a TD, so must be in both. Shallow clone it for the
  // translations node and fill it with splits of all the child nodes.
  let translations = node.cloneNode(false);
  node.childNodes.forEach(child => {
    let trans = splitOutTranslationsNode(child);
    if (trans) {
      translations.appendChild(trans);
    }
  });
  return translations;
}

export function splitOutTranslations(node: Element) : Element {
  return splitOutTranslationsNode(node) as Element;
}
