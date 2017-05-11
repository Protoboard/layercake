/* global $assert, $oop, slice */
"use strict";

/**
 * Abstract base class for function call schedulers.
 * @class $utils.Scheduler
 */
exports.Scheduler = $oop.getClass('$utils.Scheduler')
    .define(/** @lends $utils.Scheduler# */{
        /**
         * @param {number} [delay]
         * @ignore
         */
        init: function (delay) {
            $assert.isNumberOptional(delay, "Invalid schedule delay");

            /**
             * @type {number}
             */
            this.scheduleDelay = delay || 0;

            /**
             * @type {Array}
             */
            this.scheduledArguments = [];

            /**
             * @type {$utils.Timer[]}
             */
            this.scheduleTimers = [];

            /**
             * @type {$utils.Deferred}
             */
            this.schedulerDeferred = exports.Deferred.create();
        },

        /**
         * @param {Array|Arguments} args
         * @protected
         */
        _getTimerIndexByArguments: function (args) {
            var scheduledCallbackArguments = this.scheduledArguments,
                scheduledCallbackArgumentsCount = scheduledCallbackArguments.length,
                argCount = args.length,
                i, matchesArguments,
                j;

            for (i = 0; i < scheduledCallbackArgumentsCount; i++) {
                matchesArguments = true;
                for (j = 0; j < argCount; j++) {
                    if (scheduledCallbackArguments[i][j] !== args[j]) {
                        matchesArguments = false;
                        break;
                    }
                }

                if (matchesArguments) {
                    return i;
                }
            }
        },

        /**
         * @param {number} timerIndex
         * @returns {$utils.Scheduler}
         * @protected
         */
        _clearTimerAtIndex: function (timerIndex) {
            // TODO: Investigate a good middle ground bw. cpu vs. memory footprint.
            this.scheduleTimers[timerIndex] = undefined;
        }

        /**
         * @function $utils.Scheduler#schedule
         * @param {...*} arg
         * @returns {$utils.Promise}
         * @abstract
         */
    });
