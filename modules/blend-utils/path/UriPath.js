"use strict";

/**
 * @function $utils.UriPath.create
 * @param {Object} [properties]
 * @param {string[]} [properties.components] Identifiable 'steps' along the
 * path.
 * @returns {$utils.UriPath}
 */

/**
 * @class $utils.UriPath
 * @extends $utils.Path
 * @implements $utils.Stringifiable
 */
$utils.UriPath = $oop.getClass('$utils.UriPath')
.blend($oop.getClass('$utils.Path'))
.implement($oop.getClass('$utils.Stringifiable'))
.define(/** @lends $utils.UriPath# */{
  /**
   * @memberOf $utils.UriPath
   * @param {string} urlPath
   * @param {Object} [properties]
   * @returns {$utils.UriPath}
   */
  fromString: function (urlPath, properties) {
    var components = urlPath.split($utils.LOCATION_PATH_DELIMITER)
    .map(decodeURIComponent);
    return this.create({components: components}, properties);
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.components
    .map(encodeURIComponent)
    .join($utils.LOCATION_PATH_DELIMITER);
  }
});

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * Separates LocationPath components.
   * @constant
   */
  LOCATION_PATH_DELIMITER: '/'
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$data.TreePath}
   */
  toUriPath: function () {
    return $utils.UriPath.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.TreePath}
   */
  toUriPath: function () {
    return $utils.UriPath.create({components: this});
  }
});
