/* global $assert, $oop, slice */
"use strict";

/**
 * @function $utils.Debouncer.create
 * @param {number} [delay] Minimum delay between dispatched calls.
 * @returns {$utils.Debouncer}
 */

/**
 * @class $utils.Debouncer
 * @extends $utils.Scheduler
 */
exports.Debouncer = $oop.getClass('$utils.Debouncer')
    .include($oop.getClass('$utils.Scheduler'))
    .define(/** @lends $utils.Debouncer# */{
        /** @ignore */
        init: function () {
            this.elevateMethods(
                'onTimerEnd',
                'onTimerCancel');
        },

        /**
         * @param {...*} arg
         * @returns {$utils.Promise}
         */
        schedule: function (arg) {
            // looking up arguments in list
            var callbackArguments = slice.call(arguments),
                timeoutArguments = [this.scheduleDelay].concat(callbackArguments),
                timerIndex = this._getTimerIndexByArguments(callbackArguments),
                timer;

            if (typeof timerIndex === 'undefined') {
                // starting timer
                timer = exports.setTimeout.apply(exports, timeoutArguments);
                timer.timerPromise.then(
                    this.onTimerEnd,
                    this.onTimerCancel);

                // adding arg list & timer
                this.scheduledArguments.push(callbackArguments);
                this.scheduleTimers.push(timer);
            } else {
                // re-starting timer
                this.scheduleTimers[timerIndex].clearTimer();
                timer = exports.setTimeout.apply(exports, timeoutArguments);
                timer.timerPromise.then(
                    this.onTimerEnd,
                    this.onTimerCancel);

                // replacing timer in registry
                this.scheduleTimers[timerIndex] = timer;
            }

            return this.schedulerDeferred.promise;
        },

        /** @ignore */
        onTimerEnd: function () {
            // timer expired

            // resetting affected timer
            var timerIndex = this._getTimerIndexByArguments(arguments);
            this._clearTimerAtIndex(timerIndex);

            // notifying promise
            var schedulerDeferred = this.schedulerDeferred;
            schedulerDeferred.notify.apply(schedulerDeferred, arguments);
        },

        /** @ignore */
        onTimerCancel: function () {
            // timer was canceled by user

            // resetting affected timer
            var timerIndex = this._getTimerIndexByArguments(arguments);
            this._clearTimerAtIndex(timerIndex);
        }
    });
