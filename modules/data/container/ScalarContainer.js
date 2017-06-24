"use strict";

/**
 * Maintains a set of singular values. Agnostic about value storage and types.
 * Hosts are expected to implement storage-specific behavior and features.
 * @mixin $data.ScalarContainer
 * @implements $data.Filterable
 * @implements $data.Reducible
 * @extends $data.ItemContainer
 */
$data.ScalarContainer = $oop.getClass('$data.ScalarContainer')
  .extend($oop.getClass('$data.ItemContainer'))
  .implement($oop.getClass('$data.Filterable'))
  .implement($oop.getClass('$data.Reducible'))
  .define(/** @lends $data.ScalarContainer# */{
    /**
     * @returns {$data.ScalarContainer}
     */
    clone: function clone() {
      var cloned = clone.returned;
      cloned.clear();
      this.forEachItem(function (item) {
        cloned.setItem(item);
      });
      return cloned;
    },

    /**
     * Extracts items matching the condition in the specified callback
     * function and returns the result as a new collection.
     * @param {function} callback Filter function returning a boolean
     * @param {Object} [context] Context for callback
     * @returns {$data.ScalarContainer} Filtered collection
     */
    filter: function (callback, context) {
      var data = this._data instanceof Array ? [] : {},
        ResultClass = $oop.getClass(this.__classId),
        result = ResultClass.create(data);

      this.forEachItem(function (item) {
        if (callback.call(this, item)) {
          result.setItem(item);
        }
      }, context);

      return result;
    },

    /**
     * Accumulates a value based on the contribution of each item, as defined
     * by the specified callback.
     * @param {function} callback Contributes to accumulated value
     * based on current item
     * @param {*} [initialValue] Initial value for accumulated result
     * @param {Object} [context] Context for callback
     * @returns {*} Accummulated value
     */
    reduce: function (callback, initialValue, context) {
      var result = initialValue;

      this.forEachItem(function (value) {
        result = callback.call(this, result, value);
      }, context);

      return result;
    }
  });
