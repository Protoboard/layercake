"use strict";

/**
 * @function $utils.Timeout.create
 * @param {Object} properties
 * @param {number} properties.timerId
 * @returns {$utils.Timeout}
 */

/**
 * Represents a timeout ID with promise capabilities. Allows to cancel a
 * timeout via window.clearTimeout.
 * @class $utils.Timeout
 * @extends $utils.Timer
 */
$utils.Timeout = $oop.createClass('$utils.Timeout')
.blend($utils.Timer)
.define(/** @lends $utils.Timeout# */{
  /**
   * @inheritDoc
   * @returns {$utils.Timeout}
   */
  clearTimer: function () {
    clearTimeout(this.timerId);
    return this;
  }
})
.build();

/** @external Number */
$oop.copyProperties(Number.prototype, /** @lends Number# */{
  /**
   * Converts `Number` to `Timeout` instance.
   * @param {Object} [properties]
   * @returns {$utils.Timeout}
   */
  toTimeout: function (properties) {
    return $utils.Timeout.create({timerId: this.valueOf()}, properties);
  }
});
