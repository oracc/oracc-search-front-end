import { Router } from '@angular/router';

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
