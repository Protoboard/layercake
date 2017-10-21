"use strict";

/**
 * DOM manifest behavior for `Node` classes. Expects to be added to `Node`
 * classes that also have the `HtmlNode` mixin.
 * Requires browser environment.
 * @mixin $widget.DomNode
 * @augments $widget.Node
 * @augments $widget.XmlNode
 * @todo Add #onRender() here?
 * @todo Remove #render... methods? Only applicable to root widget.
 */
$widget.DomNode = $oop.getClass('$widget.DomNode')
.expect($oop.getClass('$widget.Node'))
.expect($oop.getClass('$widget.XmlNode'))
.define(/** @lends $widget.DomNode# */{
  /**
   * Renders added child node.
   * @param {$widget.DomNode} node
   * @returns {$widget.DomNode}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.saved.childNodeBefore,
        element = this.getElement(),
        childElement,
        nextChild, nextChildElement;

    if (element && node !== childNodeBefore) {
      childElement = node.createElement();
      nextChild = this.getNextChild(node);
      nextChildElement = nextChild && nextChild.getElement() || null;
      element.insertBefore(childElement, nextChildElement);
    }

    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {$widget.DomNode}
   */
  removeChildNode: function removeChildNode(nodeName) {
    var childNodeBefore = removeChildNode.saved.childNodeBefore,
        element = this.getElement(),
        childNodeElement;

    if (element && childNodeBefore) {
      childNodeElement = childNodeBefore.getElement();
      element.removeChild(childNodeElement);
    }

    return this;
  },

  /**
   * @param {$widget.DomNode} childNode
   * @param {number} nodeOrder
   * @returns {$widget.DomNode}
   */
  setChildOrder: function setChildOrder(childNode, nodeOrder) {
    var nodeOrderBefore = setChildOrder.saved.nodeOrderBefore,
        element = this.getElement(),
        childElement,
        nextChild, nextChildElement;

    if (element && nodeOrder !== nodeOrderBefore) {
      childElement = childNode.getElement();
      if (childElement) {
        // moving child element to new index
        nextChild = this.getNextChild(childNode);
        nextChildElement = nextChild && nextChild.getElement() || null;
        element.insertBefore(childElement, nextChildElement);
      }
    }

    return this;
  },

  /**
   * @param {string} attributeName
   * @param {string} attributeValue
   * @returns {$widget.DomNode}
   */
  setAttribute: function (attributeName, attributeValue) {
    var element = this.getElement();
    if (element) {
      switch (attributeName) {
      case 'style':
        element.style.cssText = attributeValue;
        break;
      default:
        element.setAttribute(attributeName, attributeValue);
        break;
      }
    }
    return this;
  },

  /**
   * @param {string} attributeName
   * @returns {$widget.DomNode}
   */
  deleteAttribute: function (attributeName) {
    var element = this.getElement();
    if (element) {
      switch (attributeName) {
      case 'style':
        element.style.cssText = '';
        break;
      default:
        element.removeAttribute(attributeName);
        break;
      }
    }
    return this;
  },

  /**
   * Creates a DOM element which reflects the node's current state.
   * @returns {Element}
   */
  createElement: function () {
    var element = document.createElement(this.elementName);

    // adding attributes to element
    this.attributes
    .forEachItem(function (attributeValue, attributeName) {
      element.setAttribute(attributeName, attributeValue);
    });

    // adding content to element
    element.innerHTML = this.childNodes.toString();

    return element;
  },

  /**
   * Fetches the currently rendered element for the current node.
   * @returns {Element}
   */
  getElement: function () {
    return document.getElementById(this.elementId);
  },

  /**
   * Renders current node and appends it to the children of the specified
   * `parentElement`.
   * @param {Element} parentElement
   * @returns {$widget.DomNode}
   */
  renderAtEnd: function (parentElement) {
    var element = this.getElement() || this.createElement();
    parentElement.appendChild(element);
    return this;
  },

  /**
   * Renders current node and prepends it to the children of the specified
   * `parentElement`.
   * @param {Element} parentElement
   * @returns {$widget.DomNode}
   */
  renderAtStart: function (parentElement) {
    var element = this.getElement() || this.createElement(),
        firstChild = parentElement.firstChild;
    if (firstChild) {
      // parent element is not empty
      parentElement.insertBefore(element, firstChild);
    } else {
      // parent element is empty
      parentElement.appendChild(element);
    }
    return this;
  },

  /**
   * Renders current node and places it before the specified element.
   * @param {Element} nextElement
   * @returns {$widget.DomNode}
   */
  renderBefore: function (nextElement) {
    var parentElement = nextElement.parentNode,
        element;
    if (parentElement) {
      element = this.getElement() || this.createElement();
      parentElement.insertBefore(element, nextElement);
    }
    return this;
  },

  /**
   * Renders current node and places it after the specified element.
   * @param {Element} previousElement
   * @returns {$widget.DomNode}
   */
  renderAfter: function (previousElement) {
    var parentElement = previousElement.parentNode,
        element,
        nextSibling;
    if (parentElement) {
      element = this.getElement() || this.createElement();
      nextSibling = previousElement.nextSibling;
      if (nextSibling) {
        // previousElement has a next sibling
        parentElement.insertBefore(element, nextSibling);
      } else {
        // previousElement is last one in parent
        parentElement.appendChild(element);
      }
    }
    return this;
  },

  /**
   * Re-renders current node.
   * @returns {$widget.DomNode}
   */
  reRender: function () {
    var element = this.getElement();
    if (element) {
      element.parentNode.replaceChild(this.createElement(), element);
    }
    return this;
  },

  /**
   * Re-renders contents of current node. Own element will not be replaced.
   * @returns {$widget.DomNode}
   */
  reRenderContents: function () {
    var element = this.getElement();
    if (element) {
      element.innerHtml = this.childNodes.toString();
    }
    return this;
  }
});
