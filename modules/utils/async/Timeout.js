/* global $assert, $oop */
"use strict";

/**
 * @function $utils.Timeout.create
 * @param {number} timerId
 * @returns {$utils.Timeout}
 */

/**
 * Represents a timeout ID with promise capabilities.
 * Allows to cancel a timeout via window.clearTimeout.
 * @class $utils.Timeout
 * @extends $utils.Timer
 */
exports.Timeout = $oop.getClass('$utils.Timeout')
    .extend($oop.getClass('$utils.Timer'))
    .define(/** @lends $utils.Timeout# */{
        /**
         * @inheritDoc
         * @returns {$utils.Timeout}
         */
        clearTimer: function () {
            clearTimeout(this.timerId);
            return this;
        }
    });

$oop.copyProperties(Number.prototype, /** @lends Number# */{
    /**
     * Converts `Number` to `Timeout` instance.
     * @returns {$utils.Timeout}
     */
    toTimeout: function () {
        return exports.Timeout.create(this.valueOf());
    }
});
