"use strict";

/**
 * @function $entity.ItemKey.create
 * @param {Object} properties
 * @param {string} properties.documentType
 * @param {string} properties.documentId
 * @param {string} properties.fieldName
 * @param {string} properties.itemId
 * @returns {$entity.ItemKey}
 */

/**
 * Identifies a collection item entity.
 * @class $entity.ItemKey
 * @extends $entity.EntityKey
 * @mixes $entity.ValueKey
 * @implements $utils.Stringifiable
 */
$entity.ItemKey = $oop.getClass('$entity.ItemKey')
.mix($oop.getClass('$entity.EntityKey'))
.mix($oop.getClass('$entity.ValueKey'))
.implement($utils.Stringifiable)
.define(/** @lends $entity.ItemKey# */{
  /**
   * Identifies the collection field the item belongs to.
   * todo Somehow this should be cached for items belonging to the same field.
   * @member {$entity.FieldKey} $entity.ItemKey#fieldKey
   */

  /**
   * Identifies the item in the context of the containing field.
   * @member {string} $entity.ItemKey#itemId
   */

  /**
   * @memberOf $entity.ItemKey
   * @param {string} documentType
   * @param {string} documentId
   * @param {string} fieldName
   * @param {string} itemId
   * @returns {$entity.ItemKey}
   */
  fromComponents: function (documentType, documentId, fieldName, itemId) {
    return this.create({
      fieldKey: $entity.FieldKey.fromComponents(
          documentType, documentId, fieldName),
      itemId: itemId
    });
  },

  /**
   * @memberOf $entity.ItemKey
   * @param {string} itemRef
   * @returns {$entity.ItemKey}
   */
  fromString: function (itemRef) {
    var components = $utils.safeSplit(itemRef, '/')
    .map(function (component) {
      return $utils.unescape(component, '/');
    });
    return this.create({
      fieldKey: $entity.FieldKey.fromComponents(
          components[0], components[1], components[2]),
      itemId: components[3]
    });
  },

  /**
   * @param {$entity.ItemKey} itemKey
   * @returns {boolean}
   */
  equals: function equals(itemKey) {
    return equals.returned &&
        this.fieldKey.equals(itemKey.fieldKey) &&
        this.itemId === itemKey.itemId;
  },

  /**
   * @inheritDoc
   * @returns {$entity.DocumentKey}
   */
  getMetaKey: function () {
    // todo Revisit whether separate meta document for item is a good idea.
    // (Vs. going together with field)
    var fieldKey = this.fieldKey;
    return $entity.MetaKey.fromMetaComponents('__item', [
      fieldKey.documentKey.documentType,
      fieldKey.fieldName
    ]);
  },

  /**
   * @inheritDoc
   * @returns {$data.Path}
   */
  getEntityPath: function () {
    var fieldKey = this.fieldKey,
        documentKey = fieldKey.documentKey;
    return $data.Path.fromComponents([
      'document',
      String(documentKey.documentType),
      String(documentKey.documentId),
      String(fieldKey.fieldName),
      String(this.itemId)]);
  },

  /**
   * Serializes current field key.
   * @example
   * $entity.ItemKey.fromComponents('user', '1234', 'name').toString()
   * // "user/1234/name"
   * @returns {string}
   */
  toString: function () {
    var fieldKey = this.fieldKey,
        documentKey = fieldKey.documentKey;
    return [
      $utils.escape(documentKey.documentType, '/'),
      $utils.escape(documentKey.documentId, '/'),
      $utils.escape(fieldKey.fieldName, '/'),
      $utils.escape(this.itemId, '/')
    ].join('/');
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.ItemKey}
   */
  toItemKey: function () {
    return $entity.ItemKey.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$entity.ItemKey}
   */
  toItemKey: function () {
    return $entity.ItemKey.fromComponents(this[0], this[1], this[2], this[3]);
  }
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$entity.ItemKey} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isItemKey: function (expr, message) {
    return $assert.assert(
        $entity.ItemKey.mixedBy(expr), message);
  },

  /**
   * @param {$entity.ItemKey} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isItemKeyOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $entity.ItemKey.mixedBy(expr), message);
  }
});