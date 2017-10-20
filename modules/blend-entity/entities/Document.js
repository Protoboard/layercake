"use strict";

/**
 * @function $entity.Document.create
 * @param {object} properties
 * @param {$entity.DocumentKey} properties.entityKey
 * @returns {$entity.Document}
 */

/**
 * @class $entity.Document
 * @extends $entity.Entity
 */
$entity.Document = $oop.getClass('$entity.Document')
.blend($oop.getClass('$entity.Entity'))
.blend($oop.getClass('$entity.BranchNoded'))
.define(/** @lends $entity.Document# */{
  /**
   * @inheritDoc
   * @member {$entity.DocumentKey} $entity.Document#entityKey
   */

  /**
   * @param {string} documentType
   * @param {string} documentId
   * @returns {$entity.Document}
   */
  fromComponents: function (documentType, documentId) {
    return this.create({
      entityKey: $entity.DocumentKey.fromComponents(documentType, documentId)
    });
  },

  /**
   * @param {string} documentRef
   * @returns {$entity.Document}
   */
  fromString: function (documentRef) {
    return this.create({
      entityKey: $entity.DocumentKey.fromString(documentRef)
    });
  },

  /**
   * @returns {Array.<string>}
   * @todo Make it on demand.
   */
  getFieldNames: function () {
    var documentKey = this.entityKey,
        attributeDocument = $entity.DocumentKey
        .fromComponents('__document', documentKey.documentType)
        .toDocument();
    return attributeDocument.getField('fields').getNode();
  },

  /**
   * Spawns events for document entity change.
   * @param {*} nodeBefore
   * @param {*} nodeAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   */
  spawnEntityChangeEvents: function spawnEntityChangeEvents(nodeBefore,
      nodeAfter
  ) {
    var events = spawnEntityChangeEvents.returned,
        document = this,
        documentKey = this.entityKey,
        documentType = documentKey.documentType,
        nodeTypeIndex = $entity.NodeTypeIndex.create(),
        leafFieldNames = nodeTypeIndex
        .getFieldNamesByFieldType(documentType, 'leaf') || [],
        branchFieldNames = nodeTypeIndex
        .getFieldNamesByFieldType(documentType, 'branch') || [];

    // adding events for leaf node fields
    leafFieldNames
    .filter(function (fieldName) {
      var fieldBefore = nodeBefore && nodeBefore[fieldName],
          fieldAfter = nodeAfter && nodeAfter[fieldName];
      return fieldAfter !== fieldBefore;
    })
    .forEach(function (fieldName) {
      // This deliberately duplicates
      // LeafNoded#spawnEntityChangeEvents for
      // performance reasons.
      var field = document.getField(fieldName);
      events.push(field.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        nodeBefore: nodeBefore && nodeBefore[fieldName],
        nodeAfter: nodeAfter && nodeAfter[fieldName]
      }));
    });

    // delegating spawning to branch node fields
    branchFieldNames
    .forEach(function (fieldName) {
      var field = document.getField(fieldName),
          fieldEvents = field.spawnEntityChangeEvents(
              nodeBefore && nodeBefore[fieldName],
              nodeAfter && nodeAfter[fieldName]);
      events = events.concat(fieldEvents);
    });

    return events;
  },

  /**
   * Retrieves a `Field` entity belonging to the current document, for the
   * specified `fieldName`.
   * @param {string} fieldName
   * @returns {$entity.FieldKey}
   */
  getField: function (fieldName) {
    return $entity.Field.fromEntityKey(this.entityKey.getFieldKey(fieldName));
  }
});

$oop.getClass('$entity.Entity')
.forwardBlend($entity.Document, function (properties) {
  return $entity.DocumentKey.mixedBy(properties.entityKey);
});

$oop.getClass('$entity.DocumentKey')
.delegate(/** @lends $entity.DocumentKey# */{
  /**
   * @returns {$entity.Document}
   */
  toDocument: function () {
    return $entity.Document.fromEntityKey(this);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.Document}
   */
  toDocument: function () {
    return $entity.Document.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$entity.Document}
   */
  toDocument: function () {
    return $entity.Document.fromComponents(this[0], this[1]);
  }
});