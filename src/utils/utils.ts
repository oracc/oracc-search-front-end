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
