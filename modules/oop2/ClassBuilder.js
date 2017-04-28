(function () {
    "use strict";

    /**
     * @class
     * TODO: Handle multiple additions (of same override).
     */
    $oop.ClassBuilder = /** @lends $oop.ClassBuilder# */{
        /**
         * All built classes indexed by class ID.
         * @memberOf $oop.ClassBuilder
         */
        builtClasses: {},

        /**
         * @param {object} properties
         * @private
         */
        _addMethodsToRegistry: function (properties) {
            var methods = this.methods = this.methods || {},
                propertyNames = Object.getOwnPropertyNames(properties),
                i, propertyName, propertyValue, methodOverrides;

            for (i = 0; i < propertyNames.length; i++) {
                propertyName = propertyNames[i];
                propertyValue = properties[propertyName];
                if (typeof propertyValue === 'function') {
                    methodOverrides = methods[propertyName] = methods[propertyName] || [];
                    methodOverrides.push(propertyValue);
                }
            }
        },

        /**
         * @returns {boolean}
         * @private
         */
        _implementsAllInterfaces: function () {
            var interfaces = this.interfaces,
                interfaceNames = Object.getOwnPropertyNames(interfaces),
                methods = this.methods;

            return interfaceNames.every(function (interfaceName) {
                var interface_ = interfaces[interfaceName],
                    propertyNames = Object.getOwnPropertyNames(interface_);
                return propertyNames.every(function (propertyName) {
                    return methods.hasOwnProperty(propertyName);
                });
            });
        },

        /**
         * Retrieves a list of method names that can be copied over 1:1.
         * @private
         */
        _getSingularMethodNames: function () {
            var methods = this.methods,
                methodNames = Object.getOwnPropertyNames(methods);

            return methodNames
                .filter(function (methodName) {
                    return methods[methodName].length === 1;
                });
        },

        /**
         * Retrieves a lookup of method names : anonymous functions that wrap
         * colliding methods coming from different sources. (Contributions, base(s), extensions.)
         * @returns {object}
         * @private
         */
        _getWrapperMethods: function () {
            var methods = this.methods,
                methodNames = Object.getOwnPropertyNames(methods),
                result = {};

            methodNames
                .filter(function (methodName) {
                    return methods[methodName].length > 1;
                })
                .forEach(function (methodName) {
                    var functions = methods[methodName],
                        functionCount = functions.length;

                    result[methodName] = function () {
                        var i;
                        for (i = 0; i < functionCount; i++) {
                            functions[i].apply(this, arguments);
                        }
                        // TODO: Return value?
                    };
                });

            return result;
        },

        /**
         * @param {string} classId
         * @returns {$oop.ClassBuilder}
         * @memberOf $oop.ClassBuilder
         */
        create: function (classId) {
            if (!classId) {
                throw new Error("No class ID was specified.");
            }

            if (this.builtClasses.hasOwnProperty(classId)) {
                throw new Error("Class " + classId + " already built.");
            }

            var result = Object.create(this);

            /**
             * Identifies class
             * @type {string}
             */
            result.classId = classId;

            /**
             * Registry of required classes
             * @type {object}
             */
            result.requires = {
                demanded: {},
                fulfilled: {}
            };

            // adding self as fulfilled require
            result.requires.fulfilled[classId] = true;

            /**
             * Registry of implemented interfaces.
             * @type {object}
             */
            result.interfaces = {};

            /**
             * Registry of extended classes.
             * @type {object}
             */
            result.extensions = {};

            /**
             * Class' own property & method contributions.
             * @type {object}
             */
            result.contributions = {};

            /**
             * Method registry.
             * Indexed by method name, then serial.
             * @type {object}
             */
            result.methods = {};

            return result;
        },

        /**
         * Specifies a required base, or trait of the host class.
         * Used by traits only.
         * @param {$oop.Class} class_
         * @returns {$oop.ClassBuilder}
         */
        require: function (class_) {
            if (!class_) {
                throw new Error("No class specified to be required.");
            }

            // registering required class
            this.requires.demanded[class_.__id] = class_;

            return this;
        },

        /**
         * Specifies an interface to be implemented by the host class.
         * Every specified interface must be fully implemented by the host class,
         * otherwise build will fail.
         * @param {$oop.Class} interface_
         * @returns {$oop.ClassBuilder}
         */
        implement: function (interface_) {
            if (!interface_) {
                throw new Error("No interface specified.");
            }

            // registering interface
            this.interfaces[interface_.__id] = interface_;

            return this;
        },

        /**
         * Specifies a class to be extended by the host class.
         * Optionally filtered by a list of property names.
         * TODO: Add option to filter by list of property names.
         * @param {$oop.Class} class_
         * @returns {$oop.ClassBuilder}
         */
        extend: function (class_) {
            if (!class_) {
                throw new Error("No class specified to extend.");
            }

            var classId = class_.__id,
                extensions = this.extensions,
                requires = this.requires,
                demandedRequires = requires.demanded,
                fulfilledRequires = requires.fulfilled,
                classRequires = class_.__requires,
                classExtends = class_.__extends,
                classRequireNames,
                classExtensionNames;

            // registering class as extension
            extensions[classId] = true;

            // adding extension to fulfilled requirements
            fulfilledRequires[classId] = true;

            // adding 2nd degree requirements & extensions as requirements
            if (classExtends) {
                classExtensionNames = classExtends && Object.keys(classExtends);
                classExtensionNames.forEach(function (extensionId) {
                    demandedRequires[extensionId] = true;
                });
            }
            if (classRequires) {
                classRequireNames = classRequires && Object.keys(classRequires);
                classRequireNames.forEach(function (requireId) {
                    demandedRequires[requireId] = true;
                });
            }

            // registering contributed methods
            var properties = class_.__contributes;
            if (properties) {
                this._addMethodsToRegistry(properties);
            }

            return this;
        },

        /**
         * Can be called multiple times.
         * @param {object} properties
         * @returns {$oop.ClassBuilder}
         */
        contribute: function (properties) {
            if (!properties) {
                throw new Error("No contributions specified.");
            }

            var contributions = this.contributions,
                propertyNames = Object.getOwnPropertyNames(properties),
                i, propertyName;

            // copying properties to overall contributions
            for (i = 0; i < propertyNames.length; i++) {
                propertyName = propertyNames[i];
                contributions[propertyName] = properties[propertyName];
            }

            // registering contributed methods
            this._addMethodsToRegistry(properties);

            return this;
        },

        /**
         * @returns {object} The created class.
         */
        build: function () {
            var classId = this.classId,
                interfaces = this.interfaces,
                extensions = this.extensions,
                requires = this.requires,
                contributions = this.contributions,
                methods = this.methods,
                result = Object.create($oop.Class);

            // checking whether
            // ... methods match interfaces
            if (interfaces) {
                if (!this._implementsAllInterfaces()) {
                    // TODO: Include the names of methods / interfaces not implemented.
                    throw new Error("Class " + classId + " doesn't implement all interfaces");
                }
            }

            // adding self to fulfilled requirements
            this.requires.fulfilled[classId] = result;

            // copying meta properties
            // ... builder
            result.__builder = this;

            // ... class ID
            result.__id = classId;

            // ... contributions
            result.__contributes = contributions;

            // ... own requires
            var requiredClassNames = Object.getOwnPropertyNames(requires.demanded);
            if (requiredClassNames.length) {
                result.__requires = {};
                requiredClassNames.forEach(function (requiredClassName) {
                    // TODO: filter by fulfilled requires
                    var require = requires.demanded[requiredClassName];
                    result.__requires[require.__id] = require;
                });
            }

            // ... extensions
            var extendedClassNames = Object.getOwnPropertyNames(extensions);
            if (extendedClassNames.length) {
                result.__extends = {};
                extendedClassNames.forEach(function (requiredClassName) {
                    var extension = extensions[requiredClassName];
                    result.__extends[extension.__id] = extension;
                });
            }

            // copying own properties
            // ... from contributions
            // ... from extensions

            // copying singular methods 1:1
            this._getSingularMethodNames()
                .forEach(function (methodName) {
                    result[methodName] = methods[methodName][0];
                });

            // copying wrapper methods
            var wrapperMethods = this._getWrapperMethods(),
                wrapperMethodNames = Object.getOwnPropertyNames(wrapperMethods);
            wrapperMethodNames
                .forEach(function (methodName) {
                    result[methodName] = wrapperMethods[methodName];
                });

            // transferring unmet trait extensions, bases, & requires as requires

            // adding class to registry
            this.builtClasses[classId] = result;

            return result;
        }
    };
}());
