"use strict";

/**
 * @function $i18n.Locale.create
 * @param {Object} properties
 * @param {$entity.DocumentKey} properties.localeKey
 * @returns {$i18n.Locale}
 */

/**
 * Represents a locale. Provides access to translations specific to the locale.
 * @class $i18n.Locale
 * @extends $event.EventListener
 * @extends $event.EventSender
 * @implements $utils.Stringifiable
 */
$i18n.Locale = $oop.createClass('$i18n.Locale')
.cacheBy(function (properties) {
  var localeKey = properties.localeKey;
  return localeKey && localeKey.toString();
})
.blend($event.EventListener)
.blend($event.EventSender)
.define(/** @lends $i18n.Locale# */{
  /**
   * @member {$entity.DocumentKey} $i18n.Locale#localeKey
   */

  /**
   * @memberOf $i18n.Locale
   * @param {$entity.DocumentKey} localeKey
   * @param {Object} [properties]
   * @returns {$i18n.Locale}
   */
  fromLocaleKey: function (localeKey, properties) {
    return this.create({localeKey: localeKey}, properties);
  },

  /**
   * @memberOf $i18n.Locale
   * @param {string} localeId
   * @param {Object} [properties]
   * @returns {$i18n.Locale}
   */
  fromLocaleId: function (localeId, properties) {
    var localeKey = $entity.DocumentKey.fromComponents('_locale', localeId);
    return this.create({localeKey: localeKey}, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(
        this.localeKey, $entity.DocumentKey, "Invalid locale key");

    var listeningPath = 'locale.' +
        $data.escapeTreePathComponent(this.localeKey.entityName);

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('locale');
  },

  /**
   * @function $i18n.Locale#_getPluralIndex
   * @param {number} n
   * @returns {number}
   * @private
   */

  /**
   * @private
   */
  _compileGetPluralIndex: function () {
    /*jshint evil:true*/
    var localeDocument = this.localeKey.toDocument(),
        pluralFormula = localeDocument.getPluralFormula();

    if (pluralFormula) {
      eval([
        //@formatter:off
        'this._getPluralIndex = function (n) {',
          'var nplurals, plural;',
          pluralFormula,
          'return Number(plural);',
        '}'
        //@formatter:on
      ].join('\n'));
    }
  },

  /**
   * Resolves count to a plural index, using the locale's *plural
   * formula*. Defaults to 0 plural index.
   * @param {number} count
   * @returns {number}
   */
  getPluralIndex: function (count) {
    if (!this._getPluralIndex) {
      this._compileGetPluralIndex();
    }
    return this._getPluralIndex ?
        this._getPluralIndex(count) :
        0;
  },

  /**
   * Retrieves translation for specified `originalString`, `context`, and
   * `count` according to the current locale.
   * @param {string} originalString
   * @param {string} context
   * @param {number} count
   * @returns {string}
   */
  getTranslation: function (originalString, context, count) {
    var translationIndex = $i18n.TranslationIndex.create(),
        localeId = this.localeKey.entityName,
        pluralIndex = this.getPluralIndex(count);

    // when specified translation is not found,
    // falling back to default context
    // then falling back to original string
    return translationIndex.getTranslation(localeId, originalString, context, pluralIndex) ||
        translationIndex.getTranslation(localeId, originalString, null, pluralIndex) ||
        originalString;
  },

  /**
   * Retrieves list of modules that have translations for current locale.
   * @returns {Array.<$module.Module>}
   */
  getModules: function () {
    var localeId = this.localeKey.entityName;

    return $i18n.ModuleLocaleIndex.create()
    .getModuleIdsForLocale(localeId)
    .map(function (moduleId) {
      return $module.Module.fromModuleId(moduleId);
    });
  },

  /**
   * Sets current locale as active locale.
   * @returns {$i18n.Locale}
   */
  setAsActiveLocale: function () {
    $i18n.LocaleEnvironment.create().setActiveLocale(this);
    return this;
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.localeKey.entityName;
  }
})
.build();

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$i18n.Locale}
   */
  toLocale: function (properties) {
    return $i18n.Locale.fromLocaleId(this.valueOf(), properties);
  }
});
