"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {Array.<$oop.Class>} mixins
   * @returns {$oop.Class}
   */
  mixClass: function (mixins) {
    return $oop.ClassMixer.mixClass(mixins);
  }
});
