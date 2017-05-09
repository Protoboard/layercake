/* global $assert */
"use strict";

/**
 * Copies properties to the specified target object.
 * For built-in prototypes, only conversion methods are allowed.
 * @function $oop.copyProperties
 * @param {object} target
 * @param {object} members
 */
exports.copyProperties = function (target, members) {
    switch (target) {
    case Array.prototype:
    case Date.prototype:
    case Number.prototype:
    case Object.prototype:
    case RegExp.prototype:
    case String.prototype:
        $assert.hasOnlyConverters(members, "Attempting to add non-conversion methods to built-in prototype.");

        Object.defineProperties(
            target,
            Object.getOwnPropertyNames(members)
                .reduce(function (definitions, memberName) {
                    definitions[memberName] = {
                        configurable: true,
                        enumerable: false,
                        value: members[memberName],
                        writable: true
                    };
                    return definitions;
                }, {}));
        break;

    default:
        Object.getOwnPropertyNames(members)
            .forEach(function (memberName) {
                target[memberName] = members[memberName];
            });
        break;
    }
};

/**
 * @function $oop.createObject
 * @param {object} base
 * @param {object} members
 * @returns {Object}
 * @ignore
 */
exports.createObject = function (base, members) {
    var result = Object.create(base || Object.prototype);
    exports.copyProperties(result, members);
    return result;
};

/**
 * @function $oop.getClass
 * @param {string} classId
 * @returns {$oop.Class}
 */
exports.getClass = function (classId) {
    return exports.Class.getClass(classId);
};