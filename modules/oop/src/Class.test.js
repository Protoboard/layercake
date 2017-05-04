/* global $oop */
"use strict";

describe("Class", function () {
    var Class,
        result;

    beforeEach(function () {
        $oop.Class.classes = {};
        Class = $oop.Class.create('Class');
    });

    describe("creation", function () {
        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    $oop.Class.create();
                }).toThrow();
            });
        });

        describe("when class already created", function () {
            beforeEach(function () {
                result = $oop.Class.create('Class');
            });

            it("should return same class", function () {
                expect(result).toBe(Class);
            });
        });

        it("should set class ID", function () {
            expect(result.__classId).toEqual('Class');
        });

        it("should initialize method lookup", function () {
            expect(result.__methodMatrix).toEqual({});
        });

        it("should initialize members container", function () {
            expect(result.__members).toEqual({});
        });

        it("should initialize contributions", function () {
            expect(result.__contributions).toEqual([]);
            expect(result.__contributionLookup).toEqual({});
        });

        it("should initialize interfaces", function () {
            expect(result.__interfaces).toEqual([]);
            expect(result.__interfaceLookup).toEqual({});
        });

        it("should initialize unimplemented method list", function () {
            expect(result.__unimplementedMethodNames).toEqual([]);
            expect(result.__unimplementedMethodNameLookup).toEqual({});
        });

        it("should initialize includes", function () {
            expect(result.__includes).toEqual([]);
            expect(result.__includeLookup).toEqual({});
        });

        it("should initialize requires", function () {
            expect(result.__requires).toEqual([]);
            expect(result.__requireLookup).toEqual({});
        });

        it("should initialize forwards list", function () {
            expect(result.__forwards).toEqual([]);
        });

        it("should initialize hash function", function () {
            expect(result.__mapper).toBeUndefined();
        });

        it("should initialize instance lookup", function () {
            expect(result.__instanceLookup).toEqual({});
        });
    });

    describe("defining members", function () {
        var batch,
            result;

        beforeEach(function () {
            batch = {
                foo: "FOO",
                bar: function () {
                }
            };
            result = Class.define(batch);
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    $oop.Class.create('Class2').define();
                }).toThrow();
            });
        });

        it("should return self", function () {
            expect(result).toBe(Class);
        });

        it("should add members", function () {
            expect(Class.__members).toEqual({
                foo: "FOO",
                bar: batch.bar
            });
        });

        describe("when member already exists", function () {
            beforeEach(function () {
                Class.define({
                    foo: "BAR"
                });
            });

            it("should overwrite members", function () {
                expect(Class.__members).toEqual({
                    foo: "BAR",
                    bar: batch.bar
                });
            });
        });

        it("should add class to contributions", function () {
            expect(Class.__contributions).toEqual([Class]);
            expect(Class.__contributionLookup).toEqual({
                Class: 0
            });
        });

        describe("when already in contributions", function () {
            beforeEach(function () {
                Class.define({
                    foo: "BAR"
                });
            });

            it("should not add again", function () {
                expect(Class.__contributions).toEqual([Class]);
                expect(Class.__contributionLookup).toEqual({
                    Class: 0
                });
            });
        });

        it("should add methods to method matrix", function () {
            expect(Class.__methodMatrix).toEqual({
                bar: [batch.bar]
            });
        });

        describe("on subsequent calls", function () {
            var batch2;

            beforeEach(function () {
                batch2 = {
                    baz: function () {
                    }
                };
                Class.define(batch2);
            });

            it("should add to the same matrix column", function () {
                expect(Class.__methodMatrix).toEqual({
                    bar: [batch.bar],
                    baz: [batch2.baz]
                });
            });
        });

        it("should copy properties to class", function () {
            expect(Class.foo).toBe("FOO");
        });

        describe("when already added", function () {
            beforeEach(function () {
                Class.define({
                    foo: "BAR"
                });
            });

            it("should overwrite properties in class", function () {
                expect(Class.foo).toBe("BAR");
            });
        });

        // TODO: Test if wrappers actually work
        it("should add wrapper methods", function () {
            expect(typeof Class.bar === 'function').toBeTruthy();
            expect(Class.bar).not.toBe(batch.bar);
        });

        describe("then implementing relevant interface", function () {
            beforeEach(function () {
                Class.implement($oop.Class.create('Interface')
                    .define({
                        bar: function () {
                        },
                        baz: function () {
                        }
                    }));
            });

            it("should not register implemented methods", function () {
                expect(Class.__unimplementedMethodNames).toEqual([
                    'baz'
                ]);
                expect(Class.__unimplementedMethodNameLookup).toEqual({
                    baz: true
                });
            });
        });
    });

    describe("implementing interface", function () {
        var Interface,
            result;

        beforeEach(function () {
            Interface = $oop.Class.create('Interface')
                .define({
                    foo: "FOO",
                    bar: function () {
                    }
                });
            result = Class.implement(Interface);
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    Class.implement();
                }).toThrow();
            });
        });

        it("should return self", function () {
            expect(result).toBe(Class);
        });

        it("should add to interfaces", function () {
            expect(Class.__interfaces).toEqual([Interface]);
            expect(Class.__interfaceLookup).toEqual({
                Interface: true
            });
        });

        describe("when already added", function () {
            it("should not add again", function () {
                Class.implement(Interface);
                expect(Class.__interfaces).toEqual([Interface]);
                expect(Class.__interfaceLookup).toEqual({
                    Interface: true
                });
            });
        });

        it("should register unimplemented methods", function () {
            expect(Class.__unimplementedMethodNames).toEqual([
                'bar'
            ]);
            expect(Class.__unimplementedMethodNameLookup).toEqual({
                bar: true
            });
        });

        describe("then defining relevant methods", function () {
            beforeEach(function () {
                Class.implement($oop.Class.create('Interface2')
                    .define({
                        baz: function () {
                        }
                    }));

                Class.define({
                    bar: function () {
                    }
                });
            });

            it("should cancel out unimplemented methods", function () {
                expect(Class.__unimplementedMethodNames).toEqual([
                    'baz'
                ]);
                expect(Class.__unimplementedMethodNameLookup).toEqual({
                    baz: true
                });
            });
        });

        describe("then including same class", function () {
            beforeEach(function () {
                Class
                    .implement($oop.Class.create('Interface2')
                        .define({
                            baz: function () {
                            }
                        }))
                    .include($oop.Class.create('Include')
                        .define({
                            bar : function () {
                            },
                            quux: function () {
                            }
                        }));
            });

            it("should cancel out unimplemented methods", function () {
                expect(Class.__unimplementedMethodNames).toEqual([
                    'baz'
                ]);
                expect(Class.__unimplementedMethodNameLookup).toEqual({
                    baz: true
                });
            });
        });
    });

    describe("including class", function () {
        var Trait;

        beforeEach(function () {
            Trait = $oop.Class.create('Trait')
                .define({
                    foo: "FOO",
                    bar: function () {
                    }
                });

            result = Class.include(Trait);
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    Class.include();
                }).toThrow();
            });
        });

        it("should return self", function () {
            expect(result).toBe(Class);
        });

        it("should add to includes", function () {
            expect(Class.__includes).toEqual([Trait]);
            expect(Class.__includeLookup).toEqual({
                Trait: true
            });
        });

        it("should add to list of contributions", function () {
            expect(Class.__contributions).toEqual([Trait]);
            expect(Class.__contributionLookup).toEqual({
                Trait: 0
            });
        });

        describe("on duplication", function () {
            beforeEach(function () {
                Class.include(Trait);
            });

            it("should not add to contributions again", function () {
                expect(Class.__contributions).toEqual([Trait]);
                expect(Class.__contributionLookup).toEqual({
                    Trait: 0
                });
            });
        });

        it("should copy properties to class", function () {
            expect(Class.foo).toBe("FOO");
        });

        it("should add wrapper methods", function () {
            expect(typeof Class.bar === 'function').toBeTruthy();
            expect(Class.bar).not.toBe(Trait.__members.bar);
        });

        describe("then implementing relevant interface", function () {
            beforeEach(function () {
                Class.implement($oop.Class.create('Interface')
                    .define({
                        bar: function () {
                        },
                        baz: function () {
                        }
                    }));
            });

            it("should not register implemented methods", function () {
                expect(Class.__unimplementedMethodNames).toEqual([
                    'baz'
                ]);
                expect(Class.__unimplementedMethodNameLookup).toEqual({
                    baz: true
                });
            });
        });

        describe("then requiring same class", function () {
            beforeEach(function () {
                Class.require(Trait);
            });

            it("should not add class to requires", function () {
                expect(Class.__requires).toEqual([]);
                expect(Class.__requireLookup).toEqual({});
            });
        });

        describe("when include has requires or includes", function () {
            var Require2, Require3, Include;

            beforeEach(function () {
                Class.require(Require2 = $oop.Class.create('Require2')
                    .include(Include = $oop.Class.create('Include'))
                    .require(Require3 = $oop.Class.create('Require3')));
            });

            it("should transfer requires", function () {
                expect(Class.__requires).toEqual([
                    Require2, Require3, Include
                ]);
                expect(Class.__requireLookup).toEqual({
                    Include : true,
                    Require2: true,
                    Require3: true
                });
            });
        });
    });

    describe("requiring class", function () {
        var Require;

        beforeEach(function () {
            Require = $oop.Class.create('Require');
            result = Class.require(Require);
        });

        describe("when passing no arguments", function () {
            it("should throw", function () {
                expect(function () {
                    Class.require();
                }).toThrow();
            });
        });

        it("should return self", function () {
            expect(result).toBe(Class);
        });

        it("should add requires", function () {
            expect(Class.__requires).toEqual([Require]);
            expect(Class.__requireLookup).toEqual({
                Require: true
            });
        });

        describe("then including same class", function () {
            beforeEach(function () {
                Class.include(Require);
            });

            it("should remove class from requires", function () {
                expect(Class.__requires).toEqual([]);
                expect(Class.__requireLookup).toEqual({});
            });
        });

        describe("when require has requires or includes", function () {
            var Require2, Require3, Include;

            beforeEach(function () {
                Class.require(Require2 = $oop.Class.create('Require2')
                    .include(Include = $oop.Class.create('Include'))
                    .require(Require3 = $oop.Class.create('Require3')));
            });

            it("should transfer requires", function () {
                expect(Class.__requires).toEqual([
                    Require, Require2, Require3, Include
                ]);
                expect(Class.__requireLookup).toEqual({
                    Include : true,
                    Require : true,
                    Require2: true,
                    Require3: true
                });
            });
        });
    });

    describe("forwarding", function () {
        var filter, Class1;

        beforeEach(function () {
            filter = function () {
            };
            Class.forward(Class1 = $oop.Class.create('Class1'), filter, 1);
        });

        describe("when passing invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    Class.forward(null, filter, 1);
                }).toThrow();
            });
        });

        it("should add forward descriptor", function () {
            expect(Class.__forwards).toEqual([{
                'class'   : Class1,
                'filter'  : filter,
                'priority': 1
            }]);
        });

        describe("when appending lower priority", function () {
            var Class2,
                filter2;

            beforeEach(function () {
                filter2 = function () {
                };
                Class.forward(Class2 = $oop.Class.create('Class2'), filter2, 10);
            });

            it("should sort descriptors by priority", function () {
                expect(Class.__forwards).toEqual([{
                    'class'   : Class2,
                    'filter'  : filter2,
                    'priority': 10
                }, {
                    'class'   : Class1,
                    'filter'  : filter,
                    'priority': 1
                }]);
            });
        });
    });

    describe("caching", function () {
        var mapper;

        beforeEach(function () {
            mapper = function () {
            };
            result = Class.cache(mapper);
        });

        describe("when passing invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    Class.cache();
                }).toThrow();
            });
        });

        it("should return self", function () {
            expect(result).toBe(Class);
        });

        it("should set hash function", function () {
            expect(Class.__mapper).toBe(mapper);
        });
    });

    describe("implementation tester", function () {
        var Interface;

        beforeEach(function () {
            Interface = $oop.Class.create('Interface');
            Class.implement(Interface);
        });

        describe("on invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    Class.implements();
                }).toThrow();
            });
        });

        describe("on present interface", function () {
            it("should return true", function () {
                expect(Class.implements(Interface)).toBe(true);
            });
        });

        describe("on absent interface", function () {
            it("should return false", function () {
                var Interface2 = $oop.Class.create('Interface2');
                expect(Class.implements(Interface2)).toBe(false);
            });
        });
    });

    describe("inclusion tester", function () {
        var Trait,
            instance;

        beforeEach(function () {
            Trait = $oop.Class.create('Trait');
            Class.include(Trait);
        });

        describe("on invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    Class.includes();
                }).toThrow();
            });
        });

        describe("on self", function () {
            it("should return true", function () {
                expect(Class.includes(Class)).toBe(true);
            });
        });

        describe("on present include", function () {
            it("should return true", function () {
                expect(Class.includes(Trait)).toBe(true);
            });
        });

        describe("on absent include", function () {
            it("should return false", function () {
                var Trait2 = $oop.Class.create('Trait2');
                expect(Class.includes(Trait2)).toBe(false);
            });
        });
    });

    describe("require tester", function () {
        var Host;

        beforeEach(function () {
            Host = $oop.Class.create('Host');
            Class.require(Host);
        });

        describe("on invalid argument", function () {
            it("should throw", function () {
                expect(function () {
                    Class.requires();
                }).toThrow();
            });
        });

        describe("on present require", function () {
            it("should return true", function () {
                expect(Class.requires(Host)).toBe(true);
            });
        });

        describe("on absent require", function () {
            it("should return false", function () {
                var Host2 = $oop.Class.create('Host2');
                expect(Class.requires(Host2)).toBe(false);
            });
        });
    });

    describe("instantiation", function () {
        var instance;

        describe("of trait", function () {
            var Host;

            beforeEach(function () {
                Host = $oop.Class.create('Host');
                Class.require(Host);
            });

            it("should throw", function () {
                expect(function () {
                    Class.create();
                }).toThrow();
            });
        });

        describe("of cached class", function () {
            beforeEach(function () {
                Class.cache(function (foo) {
                    return '_' + foo;
                });
            });

            describe("when instance is not cached yet", function () {
                it("should store new instance in cache", function () {
                    instance = Class.create('foo');
                    expect(Class.__instanceLookup).toEqual({
                        '_foo': instance
                    });
                });
            });

            describe("when instance is already cached", function () {
                var cached;

                beforeEach(function () {
                    Class.create('foo');
                    cached = Class.__instanceLookup._foo;
                });

                it("should return cached instance", function () {
                    instance = Class.create('foo');
                    expect(instance).toBe(cached);
                });
            });
        });

        describe("of forwarded class", function () {
            var Forward;

            beforeEach(function () {
                Class.define({
                    foo: function () {
                        return 'foo';
                    }
                });

                Forward = $oop.Class.create('Forward')
                    .include(Class);

                $oop.Class.create('Class')
                    .forward(Forward, function (foo) {
                        return foo === 1;
                    });
            });

            describe("for matching arguments", function () {
                it("should instantiate forward class", function () {
                    result = Class.create(1);
                    expect(result.includes(Class)).toBeTruthy();
                    expect(result.includes(Forward)).toBeTruthy();
                });
            });

            describe("for non-matching arguments", function () {
                it("should instantiate original class", function () {
                    result = Class.create(0);
                    expect(result.includes(Class)).toBeTruthy();
                    expect(result.includes(Forward)).toBeFalsy();
                });
            });

            describe("that is also cached", function () {
                var Forward2;

                beforeEach(function () {
                    Forward2 = $oop.Class.create('Forward2')
                        .cache(function (foo) {
                            return '_' + foo;
                        })
                        .include(Class);

                    $oop.Class.create('Class')
                        .forward(Forward2, function (foo) {
                            return foo === 2;
                        });
                });

                it("should return cached forward instance", function () {
                    result = Class.create(2);
                    expect(result).toBe(Forward2.__instanceLookup._2);
                });
            });
        });
    });
});
