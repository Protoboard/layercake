"use strict";

/**
 * Keeps a registry of all living instances, and makes them accessible by their
 * unique IDs.
 * @mixin $utils.Retrievable
 * @extends $utils.Identifiable
 * @implements $utils.Destructible
 */
$utils.Retrievable = $oop.createClass('$utils.Retrievable')
.implement($utils.Destructible)
.blend($utils.Identifiable)
.define(/** @lends $utils.Retrievable# */{
  /**
   * Global registry for instances having the Retrievable mixin.
   * @memberOf $utils.Retrievable
   * @type {object}
   */
  instances: {},

  /** @ignore */
  init: function () {
    this._addToInstances();
  },

  /**
   * Adds instance to global registry.
   * @returns {$utils.Retrievable}
   * @private
   */
  _addToInstances: function () {
    $utils.Retrievable.instances[this.instanceId] = this;
    return this;
  },

  /**
   * Removes instance from global registry.
   * @returns {$utils.Retrievable}
   * @private
   */
  _removeFromInstances: function () {
    delete $utils.Retrievable.instances[this.instanceId];
    return this;
  },

  /**
   * @inheritDoc
   */
  destroy: function () {
    this._removeFromInstances();
  },

  /**
   * Retrieves instance by its ID.
   * @param {number|string} instanceId
   * @returns {$utils.Retrievable}
   * @memberOf $utils.Retrievable
   */
  getInstanceById: function (instanceId) {
    return $utils.Retrievable.instances[instanceId];
  }
})
.build();
