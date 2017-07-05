"use strict";

/**
 * @function $event.OriginalEventChain#create
 * @param {string} eventName
 * @returns {$event.OriginalEventChain}
 */

/**
 * @class $event.OriginalEventChain
 * @extends $data.Chain
 */
$event.OriginalEventChain = $oop.getClass('$event.OriginalEventChain')
.mix($data.Chain)
.cache(function () {
  return 'singleton';
});
