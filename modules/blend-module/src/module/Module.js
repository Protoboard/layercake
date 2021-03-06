"use strict";

/**
 * @function $module.Module.create
 * @param {Object} properties
 * @param {string} properties.moduleId
 * @returns {$module.Module}
 */

/**
 * @class $module.Module
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$module.Module = $oop.createClass('$module.Module')
.cacheBy(function (properties) {
  return properties.moduleId;
})
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $module.Module# */{
  /**
   * @member {string} $module.Module#moduleId
   */

  /**
   * @memberOf $module.Module
   * @param moduleId
   * @param {Object} [properties]
   * @returns {$module.Module}
   */
  fromModuleId: function (moduleId, properties) {
    return this.create({
      moduleId: moduleId
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.moduleId, "Invalid module ID");

    var listeningPath = 'module.' + $data.escapeTreePathComponent(this.moduleId);

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('module');
  },

  /**
   * Marks module as available.
   * @returns {$module.Module}
   */
  markAsAvailable: function () {
    var modulePath;

    if (!this.isAvailable()) {
      // storing module information in container
      modulePath = $data.TreePath.fromString(this.moduleId);
      $module.modules.setNode(modulePath, {});

      // triggering event about change
      this.trigger($module.EVENT_MODULE_AVAILABLE);
    }

    return this;
  },

  /**
   * Tells whether current module is available.
   * @returns {boolean}
   */
  isAvailable: function () {
    var modulePath = $data.TreePath.fromString(this.moduleId);
    return !!$module.modules.getNode(modulePath);
  }
})
.build();

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$module.Module}
   */
  toModule: function (properties) {
    return $module.Module.fromModuleId(this.valueOf(), properties);
  }
});
