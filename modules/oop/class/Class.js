/* global $assert, hOP */
"use strict";

/**
 * Composable class.
 * @class $oop.Class
 */
exports.Class = exports.createObject(Object.prototype, /** @lends $oop.Class# */{
    /**
     * All classes indexed by class ID.
     * @memberOf $oop.Class
     * @type {object}
     */
    classLookup: {},

    /**
     * Fetches the class by the specified ID.
     * Creates the class if it doesn't exist yet.
     * @memberOf $oop.Class
     * @param {string} classId
     * @returns {$oop.Class}
     */
    getClass: function (classId) {
        $assert.isString(classId, "No class ID was specified.");

        var classes = this.classLookup,
            Class = classes[classId];

        if (!Class) {
            // class is not initialized yet
            Class = exports.createObject(exports.Class, /** @lends $oop.Class# */{
                /**
                 * Identifies class.
                 * @type {string}
                 */
                __classId: classId,

                /**
                 * Properties and methods contributed by the current class.
                 * @type {object}
                 */
                __members: {},

                /**
                 * Registry of interfaces implemented by the current class,
                 * and classes implementing the current class as an interface.
                 * @type {{forward: {list: Array, lookup: object}, reverse: {list: Array, lookup: object}}}
                 */
                __interfaces: {
                    forward: {list: [], lookup: {}},
                    reverse: {list: [], lookup: {}}
                },

                /**
                 * Registry of classes included by the current class,
                 * and classes that include the current class.
                 * @type {{forward: {list: Array, lookup: object}, reverse: {list: Array, lookup: object}}}
                 */
                __includes: {
                    forward: {list: [], lookup: {}},
                    reverse: {list: [], lookup: {}}
                },

                /**
                 * Registry of classes required by the current class,
                 * and classes requiring the current class.
                 * @type {{forward: {list: Array, lookup: object}, reverse: {list: Array, lookup: object}}}
                 */
                __requires: {
                    forward: {list: [], lookup: {}},
                    reverse: {list: [], lookup: {}}
                },

                /**
                 * Registry of methods not implemented by current class.
                 * @type {{list: Array, lookup: object}}
                 */
                __missingMethodNames: {list: [], lookup: {}},

                /**
                 * Registry of all classes contributing members to the current class.
                 * @type {{list: Array, lookup: object}}
                 */
                __contributors: {list: [], lookup: {}},

                /**
                 * Two dimensional lookup of methods contributed to the class.
                 * Indexed by method name, then contributor index. (Index of contributor in __contributors.list.)
                 * @type {object}
                 */
                __methodMatrix: {},

                /**
                 * List of forwards (surrogate) descriptors.
                 * @type {Array.<{class: $oop.Class, filter: function, priority: number}>}
                 */
                __forwards: [],

                /**
                 * Hash function for caching instances.
                 * TODO: Rename
                 * @type {function}
                 */
                __mapper: undefined,

                /**
                 * Lookup of cached instances indexed by hash.
                 * @type {object}
                 */
                __instanceLookup: {}
            }, {
                writable: true,
                enumerable: false,
                configurable: true
            });

            // adding class to registry
            classes[classId] = Class;
        }

        return Class;
    },

    /**
     * Copies batch of members to class members container.
     * @param {object} batch
     * @private
     */
    _addToMembers: function (batch) {
        var members = this.__members;

        Object.getOwnPropertyNames(batch)
            .forEach(function (memberName) {
                members[memberName] = batch[memberName];
                return members;
            });
    },

    /**
     * Adds class to contributions
     * @param {$oop.Class} Class
     * @private
     */
    _addToContributors: function (Class) {
        var contributors = this.__contributors,
            contributorList = contributors.list,
            contributorLookup = contributors.lookup,
            classId = Class.__classId;

        if (!hOP.call(contributorLookup, classId)) {
            contributorLookup[classId] = contributorList.length;
            contributorList.push(Class);
        }
    },

    /**
     * Adds methods to method lookup, indexed by method name, then order.
     * @param {object} members
     * @param {string} classId
     * @private
     */
    _addMethodsToMatrix: function (members, classId) {
        var methodMatrix = this.__methodMatrix,
            classIndex = this.__contributors.lookup[classId];

        Object.getOwnPropertyNames(members)
            .filter(function (memberName) {
                return typeof members[memberName] === 'function';
            })
            .forEach(function (methodName) {
                var methods = methodMatrix[methodName];
                if (!methods) {
                    methods = methodMatrix[methodName] = [];
                }
                methods[classIndex] = members[methodName];
            });
    },

    /**
     * Adds properties to class.
     * @param {object} members
     * @private
     */
    _addPropertiesToClass: function (members) {
        var Class = exports.Class,
            that = this;

        Object.getOwnPropertyNames(members)
            .filter(function (memberName) {
                return typeof members[memberName] !== 'function';
            })
            .forEach(function (propertyName) {
                var propertyValue = members[propertyName];

                if (Class.isPrototypeOf(propertyValue) &&
                    Object.getPrototypeOf(propertyValue) !== Class
                ) {
                    $assert.assert(false, [
                        "Instance not allowed as static property value for '" + that.__classId + "." + propertyName + "'.",
                        "Can't build."
                    ].join(" "));
                }

                that[propertyName] = propertyValue;
            });
    },

    /**
     * Adds wrapper methods for functions contributed to the class.
     * Wrapper methods cycle through versions of the same method,
     * and call them in the order of contributions.
     * For performance reasons, wrapper methods return the result of the last call.
     * It's the responsibility of each contributed method to ensure access
     * to its individual return value, if needed.
     * TODO: Add original method when there's only 1 contribution.
     * @param {object} members
     * @private
     */
    _addWrapperMethodsToClass: function (members) {
        var that = this;

        Object.getOwnPropertyNames(members)
            .filter(function (memberName) {
                return typeof members[memberName] === 'function';
            })
            .filter(function (methodName) {
                return !hOP.call(that, methodName);
            })
            .forEach(function (methodName) {
                var methodMatrix = that.__methodMatrix;

                that[methodName] = function () {
                    var methods = methodMatrix[methodName],
                        methodCount = methods.length,
                        i, method, result;

                    // calling function in order of contributions
                    for (i = 0; i < methodCount; i++) {
                        method = methods[i];
                        if (method) {
                            result = method.apply(this, arguments);
                        }
                    }

                    return result;
                };
            });
    },

    /**
     * @param {$oop.Class} Interface
     * @private
     */
    _addToInterfaces: function (Interface) {
        var interfaces = this.__interfaces.forward,
            interfaceList = interfaces.list,
            interfaceLookup = interfaces.lookup,
            interfaceId = Interface.__classId;

        if (!hOP.call(interfaceLookup, interfaceId)) {
            interfaceList.push(Interface);
            interfaceLookup[interfaceId] = Interface;
        }
    },

    /**
     * @param {$oop.Class} Class
     * @private
     */
    _addToImplementers: function (Class) {
        var implementers = this.__interfaces.reverse,
            implementerList = implementers.list,
            implementerLookup = implementers.lookup,
            classId = Class.__classId;

        if (!hOP.call(implementerLookup, classId)) {
            implementerList.push(Class);
            implementerLookup[classId] = Class;
        }
    },

    /**
     * @param {object} members
     * @private
     */
    _removeFromMissingMethods: function (members) {
        var missingMethodNames = this.__missingMethodNames.list,
            missingMethodLookup = this.__missingMethodNames.lookup;

        // removing methods from registry
        Object.getOwnPropertyNames(members)
            .filter(function (memberName) {
                return typeof members[memberName] === 'function';
            })
            // leaving only those already registered
            .filter(function (methodName) {
                return hOP.call(missingMethodLookup, methodName);
            })
            // unregistering method names
            .forEach(function (implementedMethodName) {
                missingMethodNames.splice(missingMethodNames.indexOf(implementedMethodName), 1);
                delete missingMethodLookup[implementedMethodName];
            });
    },

    /**
     * Adds functions in members to registry of missing methods names,
     * unless they're already implemented by the class, or any of the includes.
     * @param {object} members
     * @private
     */
    _addToMissingMethods: function (members) {
        var contributions = this.__contributors.list,
            interfaces = this.__interfaces.forward.list,
            missingMethodNames = this.__missingMethodNames.list,
            missingMethodLookup = this.__missingMethodNames.lookup;

        Object.getOwnPropertyNames(members)
            .filter(function (memberName) {
                return typeof members[memberName] === 'function';
            })
            // leaving out any methods already found in contributions
            .filter(function (methodName) {
                return !contributions.some(function (Class) {
                    var method = Class.__members[methodName];
                    return typeof method === 'function';
                });
            })
            // leaving out methods not found in any interfaces
            .filter(function (methodName) {
                return interfaces.some(function (Interface) {
                    var method = Interface.__members[methodName];
                    return typeof method === 'function';
                });
            })
            // leaving only those not yet registered
            .filter(function (missingMethodName) {
                return !hOP.call(missingMethodLookup, missingMethodName);
            })
            // registering method names as missing
            .forEach(function (missingMethodName) {
                missingMethodNames.push(missingMethodName);
                missingMethodLookup[missingMethodName] = true;
            });
    },

    /**
     * @param {$oop.Class} Class
     * @private
     */
    _addToIncludes: function (Class) {
        var includes = this.__includes.forward,
            includeList = includes.list,
            includeLookup = includes.lookup,
            classId = Class.__classId;

        if (!hOP.call(includeLookup, classId)) {
            includeList.push(Class);
            includeLookup[classId] = Class;
        }
    },

    /**
     * @param {$oop.Class} Class
     * @private
     */
    _addToIncluders: function (Class) {
        var hosts = this.__includes.reverse,
            hostList = hosts.list,
            hostLookup = hosts.lookup,
            classId = Class.__classId;

        if (!hOP.call(hostLookup, classId)) {
            hostList.push(Class);
            hostLookup[classId] = Class;
        }
    },

    /**
     * @param {$oop.Class} Class
     * @private
     */
    _addToRequires: function (Class) {
        var classId = this.__classId,
            requireId = Class.__classId,
            includeLookup = this.__includes.forward.lookup,
            requires = this.__requires.forward,
            requireList = requires.list,
            requireLookup = requires.lookup;

        if (classId !== requireId &&
            !hOP.call(includeLookup, requireId) &&
            !hOP.call(requireLookup, requireId)
        ) {
            // require is not included (which would cancel each other out)
            // adding to requires
            requireList.push(Class);
            requireLookup[requireId] = Class;
        }
    },

    /**
     * @param {$oop.Class} Class
     * @private
     */
    _addToHosts: function (Class) {
        var hosts = this.__requires.reverse,
            hostList = hosts.list,
            hostLookup = hosts.lookup,
            classId = Class.__classId;

        if (!hOP.call(hostLookup, classId)) {
            hostList.push(Class);
            hostLookup[classId] = Class;
        }
    },

    /**
     * @param {$oop.Class} Class
     * @private
     */
    _removeFromRequires: function (Class) {
        var classId = Class.__classId,
            requires = this.__requires.forward,
            requireList = requires.list,
            requireLookup = requires.lookup;

        if (hOP.call(requireLookup, classId)) {
            requireList.splice(requireList.indexOf(classId), 1);
            delete requireLookup[classId];
        }
    },

    /**
     * Extracts includes and requires from class and transfers them
     * to the current class as first-degree requires.
     * @param {$oop.Class} Class
     * @private
     */
    _transferRequiresFrom: function (Class) {
        var that = this;

        // transferring requires & includes of class to current class as requires
        Class.__requires.forward.list.concat(Class.__includes.forward.list)
            .forEach(function (Class) {
                // adding require to registry
                that._addToRequires(Class);

                // adding to hosts on require
                Class._addToHosts(that);
            });

        // transferring class AS require to includers and hosts of current class
        this.__includes.reverse.list.concat(this.__requires.reverse.list)
            .forEach(function (Host) {
                // adding require to registry
                Host._addToRequires(Class);

                // adding to hosts on require
                Class._addToHosts(Host);
            });
    },

    /**
     * Delegates a batch of methods to includers.
     * @param {object} members
     * @private
     */
    _delegateToIncluders: function (members) {
        var classId = this.__classId;

        this.__includes.reverse.list
            .forEach(function (Class) {
                // adding methods to lookup at specified index
                Class._addMethodsToMatrix(members, classId);

                // adding / overwriting properties
                Class._addPropertiesToClass(members);

                // adding wrapper method when necessary
                Class._addWrapperMethodsToClass(members);

                // updating missing method names
                Class._removeFromMissingMethods(members);
            });
    },

    /**
     * Delegates a batch of methods to imeplementers.
     * (As possibly missing methods.)
     * @param {object} members
     * @private
     */
    _delegateToImplementers: function (members) {
        this.__interfaces.reverse.list
            .forEach(function (Class) {
                // updating missing method names
                Class._addToMissingMethods(members);
            });
    },

    /**
     * Collects all contributors of specified class, traversing its entire dependency tree.
     * @param {$oop.Class} Class
     * @returns {$oop.Class[]}
     * @private
     */
    _gatherAllContributorsFrom: function (Class) {
        var contributors = [],
            contributorLookup = {};

        (function getContributors(Class) {
            var classId = Class.__classId,
                contributorList = Class.__contributors.list,
                contributorCount = contributorList.length,
                i, contributor;

            // adding deeper inclusions' contributions first
            // to maintain order of method calls
            for (i = 0; i < contributorCount; i++) {
                contributor = contributorList[i];
                if (contributor !== Class) {
                    getContributors(contributor);
                }
            }

            // all dependents' contributions have been added,
            // adding current class
            if (!contributorLookup[classId]) {
                contributors.push(Class);
                contributorLookup[classId] = Class;
            }
        }(Class));

        return contributors;
    },

    /**
     * Creates a new instance.
     * @returns {$oop.Class}
     */
    create: function () {
        // retrieving forward class (if any)
        var that = this,
            forwards = this.__forwards,
            forwardsCount = forwards.length,
            i, forward;
        for (i = 0; i < forwardsCount; i++) {
            forward = forwards[i];
            if (forward.filter.apply(this, arguments)) {
                // ctr arguments fit forward filter
                // forwarding
                that = forward['class'];
                break;
            }
        }

        // fetching cached instance
        var mapper = that.__mapper,
            instances,
            instanceId, instance;
        if (mapper) {
            instances = that.__instanceLookup;
            instanceId = mapper.apply(this, arguments);
            instance = instances[instanceId];
            if (instance) {
                // instance found in cache
                return instance;
            }
        }

        // checking whether
        // ... methods match interfaces
        var missingMethodNames = this.__missingMethodNames.list;
        if (missingMethodNames.length) {
            $assert.assert(false, [
                "Class '" + that.__classId + "' doesn't implement method(s): " +
                missingMethodNames
                    .map(function (methodName) {
                        return "'" + methodName + "'";
                    }) + ".",
                "Can't instantiate."
            ].join(" "));
        }

        // ... all requires are included
        var requires = that.__requires.forward.list;
        if (requires.length) {
            // there are unfulfilled requires - can't instantiate
            $assert.assert(false, [
                "Class '" + that.__classId + "' doesn't satisfy require(s): " +
                requires
                    .map(function (Class) {
                        return "'" + Class.__classId + "'";
                    })
                    .join(",") + ".",
                "Can't instantiate."
            ].join(" "));
        }

        // instantiating class
        instance = Object.create(that);

        // invoking .init
        // initializing instance properties
        if (typeof that.init === 'function') {
            // running instance initializer
            that.init.apply(instance, arguments);
        }

        // caching instance (if necessary)
        if (mapper) {
            instances[instanceId] = instance;
        }

        return instance;
    },

    /**
     * Defines a batch of properties and methods contributed by the current class.
     * Can be called multiple times.
     * @param {object} batch
     * @returns {$oop.Class}
     */
    define: function (batch) {
        $assert.isObject(batch, "No members specified.");

        // adding batch to members, overwriting conflicting properties
        this._addToMembers(batch);

        // marking self as contributor
        this._addToContributors(this);

        // adding methods to lookup at specified index
        this._addMethodsToMatrix(batch, this.__classId);

        // adding / overwriting properties
        this._addPropertiesToClass(batch);

        // adding wrapper method when necessary
        this._addWrapperMethodsToClass(batch);

        // updating missing methods names
        this._removeFromMissingMethods(batch);

        // delegating batch to includers
        this._delegateToIncluders(batch);

        // updating implementers
        this._delegateToImplementers(batch);

        return this;
    },

    /**
     * Specifies a class to be included by the host class.
     * @param {$oop.Class} Class
     * @returns {$oop.Class}
     */
    include: function (Class) {
        $assert.isClass(Class, "Class#include expects type Class.");

        // TODO: Detect & throw on circular include

        // adding to includes
        this._addToIncludes(Class);

        // adding to reverse includes
        Class._addToIncluders(this);

        // adding included class to contributions
        this._addToContributors(Class);

        // removing fulfilled require
        this._removeFromRequires(Class);

        // transferring includes & requires from include
        this._transferRequiresFrom(Class);

        var members = Class.__members;

        // adding methods to lookup at specified index
        this._addMethodsToMatrix(members, Class.__classId);

        // adding / overwriting properties
        this._addPropertiesToClass(members);

        // adding wrapper method when necessary
        this._addWrapperMethodsToClass(members);

        // updating missing method names
        this._removeFromMissingMethods(members);

        return this;
    },

    /**
     * Includes specified class and all its includes, direct or indirect.
     * @param {$oop.Class} Class
     * @returns {$oop.Class}
     */
    extend: function (Class) {
        // gathering all dependencies (including Class)
        var that = this,
            contributors = this._gatherAllContributorsFrom(Class);

        // including all dependencies
        contributors.forEach(function (Class) {
            that.include(Class);
        });

        return this;
    },

    /**
     * Specifies an interface to be implemented by the host class.
     * @param {$oop.Class} Interface
     * @returns {$oop.Class}
     */
    implement: function (Interface) {
        $assert.isClass(Interface, "Class#implement expects type Class.");

        // adding to interfaces
        this._addToInterfaces(Interface);

        // adding to implementers on Interface
        Interface._addToImplementers(this);

        // updating missing method names
        this._addToMissingMethods(Interface.__members);

        return this;
    },

    /**
     * Specifies a required base, or trait of the host class.
     * Used by traits only.
     * @param {$oop.Class} Class
     * @returns {$oop.Class}
     */
    require: function (Class) {
        $assert.isClass(Class, "Class#require expects type Class.");

        // adding require to registry
        this._addToRequires(Class);

        // adding to hosts on require
        Class._addToHosts(this);

        // transferring includes & requires from require
        this._transferRequiresFrom(Class);

        return this;
    },

    /**
     * Forwards the class to the specified class, if
     * constructor arguments satisfy the supplied filter.
     * @param {$oop.Class} Class
     * @param {function} filter
     * @param {number} [priority=0]
     * @returns {$oop.Class}
     */
    forward: function (Class, filter, priority) {
        $assert.isClass(Class, "Class#forward expects type Class.");

        var forwards = this.__forwards;

        // adding forward descriptor
        forwards.push({
            'class': Class,
            'filter': filter,
            'priority': priority || 0
        });

        // sorting forwards by priority (descending)
        // here we're relying on Array#sort() mutating the array
        // as the same array is referenced from the final class
        forwards.sort(function (a, b) {
            var ap = a.priority,
                bp = b.priority;
            return ap > bp ? -1 : bp > ap ? 1 : 0;
        });

        return this;
    },

    /**
     * Specifies a mapper function to be used to build a registry
     * @todo Rename
     * @param {function} mapper
     * @returns {$oop.Class}
     */
    cache: function (mapper) {
        $assert.isFunction(mapper, "Class#cache expects function argument.");

        this.__mapper = mapper;

        return this;
    },

    /**
     * Tells whether current class implements the specified interface.
     * @param {$oop.Class} Interface
     * @returns {boolean}
     */
    implements: function (Interface) {
        $assert.isClass(Interface, "Class type expected");

        return !!this.__interfaces.forward.lookup[Interface.__classId];
    },

    /**
     * Tells whether the specified class implements the current Interface.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    isImplementedBy: function (Class) {
        return exports.Class.isPrototypeOf(Class) &&
            Class.implements(this);
    },

    /**
     * Tells whether current class is or includes the specified class.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    includes: function (Class) {
        $assert.isClass(Class, "Class type expected");

        var classId = Class.__classId;

        return this.__classId === classId || !!this.__includes.forward.lookup[classId];
    },

    /**
     * Tells whether the specified class includes the current class.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    isIncludedBy: function (Class) {
        return exports.Class.isPrototypeOf(Class) &&
            Class.includes(this);
    },

    /**
     * Tells whether current class requires the specified class.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    requires: function (Class) {
        $assert.isClass(Class, "Class type expected");

        return !!this.__requires.forward.lookup[Class.__classId];
    },

    /**
     * Tells whether specified class requires the current class.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    isRequiredBy: function (Class) {
        return exports.Class.isPrototypeOf(Class) &&
            Class.requires(this);
    },

    /**
     * Binds and stores the specified methods on the instance,
     * so they're reusable as callbacks.
     * @param {...string} methodName
     * @returns {$oop.Class}
     */
    elevateMethods: function (methodName) {
        var argumentCount = arguments.length,
            i, method;

        for (i = 0; i < argumentCount; i++) {
            methodName = arguments[i];
            if (hOP.call(this, methodName)) {
                $assert.assert(false, "Method '" + this.__classId + "#" + methodName + "' already elevated.");
            } else {
                method = this[methodName];
                if (typeof method !== 'function') {
                    $assert.assert(false, [
                        "Method '" + this.__classId + '#' + methodName + "' not a function.",
                        "Can't elevate."
                    ].join(" "));
                } else {
                    this[methodName] = this[methodName].bind(this);
                }
            }
        }

        return this;
    }
});

/**
 * @param {$oop.Class} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isClass = function (expr, message) {
    return $assert.assert(
        exports.Class.isPrototypeOf(expr), message);
};

/**
 * @param {$oop.Class} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isClassOptional = function (expr, message) {
    return $assert.assert(
        typeof expr === 'undefined' ||
        exports.Class.isPrototypeOf(expr), message);
};
