"use strict";

/**
 * @function $cliTools.Argv.create
 * @param {Object} [properties]
 * @returns {$cliTools.Argv}
 */

/**
 * @class $cliTools.Argv
 */
$cliTools.Argv = $oop.createClass('$cliTools.Argv')
.define(/** @lends $cliTools.Argv# */{
  /**
   * @member {$data.Collection.<string,>} $cliTools.Argv#argumentCollection
   */

  /**
   * @member {$data.Collection.<string,>} $cliTools.Argv#options
   */

  /**
   * @memberOf $cliTools.Argv
   * @param {Array.<string>} argv
   */
  fromArray: function (argv) {
    var argumentCollection = $data.Collection.fromData(argv)
    .mapKeys(function (argument) {
      return argument;
    })
    .passEachValueTo($cliTools.Argument.fromString, $cliTools.Argument)
    .toCollection();

    return this.create({
      argumentCollection: argumentCollection
    });
  },

  /** @ignore */
  defaults: function () {
    this.argumentCollection = this.argumentCollection || $data.Collection.create();
  },

  /** @ignore */
  init: function () {
    this.options = this.argumentCollection
    .filterByValueType($cliTools.Option)
    .mapKeys(function (option) {
      return option.optionName;
    })
    .toCollection();
  },

  /**
   * Retrieves value of specified option.
   * @param {string} optionName
   * @returns {string}
   */
  getOptionValue: function (optionName) {
    var option = this.options.getValue(optionName);
    return option && option.optionValue;
  },

  /**
   * Determines whether the specified option exists.
   * @param {string} optionName
   * @returns {boolean}
   */
  hasOption: function (optionName) {
    return !!this.options.getValue(optionName);
  }
})
.build();
