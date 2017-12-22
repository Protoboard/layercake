"use strict";

/**
 * XML manifest behavior for `Node` classes.
 * @class $widget.XmlNode
 * @extends $widget.Node
 * @implements $utils.Stringifiable
 */
$widget.XmlNode = $oop.createClass('$widget.XmlNode')
.expect($widget.Node)
.implement($utils.Stringifiable)
.define(/** @lends $widget.XmlNode# */{
  /**
   * Name of the XML element associated with the current node. Eg. 'html',
   * 'div', etc.
   * @member {string} $widget.XmlNode#elementName
   */

  /**
   * @member {$widget.XmlAttributes} $widget.XmlNode#attributes
   */

  /**
   * @memberOf $widget.XmlNode
   * @param {string} elementName
   * @param {Object} [properties]
   * @returns {$widget.XmlNode}
   */
  fromElementName: function (elementName, properties) {
    return this.create({elementName: elementName}, properties);
  },

  /** @ignore */
  defaults: function () {
    this.attributes = this.attributes || $widget.XmlAttributes.create();
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.elementName, "Invalid elementName");

    var childNodes = this.childNodes;
    this.childNodes = childNodes ?
        childNodes.as($widget.XmlNodes) :
        $widget.XmlNodes.create();
  },

  /**
   * @param {string} attributeName
   * @param {string} attributeValue
   * @returns {$widget.XmlNode}
   */
  setAttribute: function (attributeName, attributeValue) {
    this.attributes.setItem(attributeName, attributeValue);
    return this;
  },

  /**
   * @param {string} attributeName
   * @returns {string}
   */
  getAttribute: function (attributeName) {
    return this.attributes.getValue(attributeName);
  },

  /**
   * @param {string} attributeName
   * @returns {$widget.XmlNode}
   */
  deleteAttribute: function (attributeName) {
    this.attributes.deleteItem(attributeName);
    return this;
  },

  /**
   * @returns {string}
   */
  getContentMarkup: function () {
    return this.childNodes.toString();
  },

  /**
   * @returns {string}
   */
  toString: function () {
    var elementName = $widget.escapeXmlEntities(this.elementName),
        attributes = this.attributes;
    return [
      '<' + elementName + (attributes.getItemCount() ? (' ' + attributes) : '') + '>',
      this.getContentMarkup(),
      '</' + elementName + '>'
    ].join('');
  }
})
.build();
