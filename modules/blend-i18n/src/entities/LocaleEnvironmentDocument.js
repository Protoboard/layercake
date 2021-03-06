"use strict";

/**
 * @function $i18n.LocaleEnvironmentDocument.create
 * @param {object} properties
 * @param {$entity.DocumentKey} properties.entityKey
 * @returns {$i18n.LocaleEnvironmentDocument}
 */

/**
 * @class $i18n.LocaleEnvironmentDocument
 * @extends $entity.Document
 */
$i18n.LocaleEnvironmentDocument = $oop.createClass('$i18n.LocaleEnvironmentDocument')
.blend($entity.Document)
.define(/** @lends $i18n.LocaleEnvironmentDocument# */{
  /**
   * Sets active locale key.
   * @param {$entity.DocumentKey} activeLocaleKey
   * @returns {$i18n.LocaleEnvironmentDocument}
   */
  setActiveLocaleKey: function (activeLocaleKey) {
    var activeLocaleRef = activeLocaleKey && activeLocaleKey.toString();
    this.getField('activeLocale').setNode(activeLocaleRef);
    return this;
  },

  /**
   * Retrieves active locale key.
   * @returns {$entity.DocumentKey}
   */
  getActiveLocaleKey: function () {
    var activeLocaleRef = this.getField('activeLocale').getNode();
    return activeLocaleRef && $entity.DocumentKey.fromReference(activeLocaleRef);
  }
})
.build();

$entity.Document
.forwardBlend($i18n.LocaleEnvironmentDocument, function (properties) {
  var documentKey = properties.entityKey;
  return documentKey && documentKey.documentType === '_localeEnvironment';
});
