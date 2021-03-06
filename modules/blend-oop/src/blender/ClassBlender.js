"use strict";

/**
 * @class $oop.ClassBlender
 */
$oop.ClassBlender = $oop.createObject(Object.prototype, /** @lends $oop.ClassBlender */{
  /**
   * @param {$oop.Class} Class
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @private
   */
  _classMatchesMixins: function (Class, mixinBuilders) {
    var mixinsA = Class.__builder.mixins.downstream.list,
        mixinCountA = mixinsA.length,
        mixinCountB = mixinBuilders.length,
        i;

    if (mixinCountA === mixinCountB) {
      for (i = 0; i < mixinCountA; i++) {
        if (mixinsA[i] !== mixinBuilders[i]) {
          return false;
        }
      }
    } else {
      return false;
    }

    return true;
  },

  /**
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @return {Array.<$oop.Class>}
   * @private
   */
  _findMatchingClass: function (mixinBuilders) {
    var classes = $oop.classes,
        classCount = classes.length,
        i, Class;
    for (i = 0; i < classCount; i++) {
      Class = classes[i];
      if (this._classMatchesMixins(Class, mixinBuilders)) {
        return Class;
      }
    }
  },

  /**
   * @param {Array.<$oop.Class>} mixins
   * @return {$oop.Class}
   * @private
   */
  _blendClass: function (mixins) {
    var classBuilder = $oop.createClass(),
        mixinCount = mixins.length,
        i;
    for (i = 0; i < mixinCount; i++) {
      classBuilder.blend(mixins[i]);
    }
    return classBuilder.build();
  },

  /**
   * Creates and ad-hoc class that blends `mixins` in the specified order.
   * @param {Array.<$oop.Class>} mixins
   * @return {$oop.Class}
   */
  blendClass: function (mixins) {
    var mixinBuilders = mixins.map(function (Mixer) {
      return Mixer.__builder;
    });

    return $oop.BlenderIndex.getClassForMixins(mixinBuilders) ||
        this._findMatchingClass(mixinBuilders) ||
        this._blendClass(mixins);
  }
});
