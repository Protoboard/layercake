"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-oop'];

describe("Deferred", function () {
    var deferred;

    beforeEach(function () {
        deferred = $utils.Deferred.create();
    });

    describe("instantiation", function () {
        it("should initialize promise property", function () {
            expect($utils.Promise.isIncludedBy(deferred.promise)).toBeTruthy();
        });
    });

    describe("resolution", function () {
        var result;

        beforeEach(function () {
            deferred.promise
                .then(function () {})
                .then(function () {});

            spyOn(deferred.promise.successHandlers, '0');
            spyOn(deferred.promise.successHandlers, '1');

            result = deferred.resolve("foo", "bar");
        });

        it("should return self", function () {
            expect(result).toBe(deferred);
        });

        describe("when promise state is other than unfulfilled", function () {
            beforeEach(function () {
                deferred.promise.promiseState = $utils.PROMISE_STATE_FULFILLED;
                result = deferred.resolve("foo", "bar");
            });

            it("should not call handlers", function () {
                expect(deferred.promise.successHandlers[0]).toHaveBeenCalledTimes(1);
                expect(deferred.promise.successHandlers[1]).toHaveBeenCalledTimes(1);
            });
        });

        it("should call handlers with resolution arguments", function () {
            expect(deferred.promise.successHandlers[0]).toHaveBeenCalledWith("foo", "bar");
            expect(deferred.promise.successHandlers[1]).toHaveBeenCalledWith("foo", "bar");
        });

        it("should set promise state to fulfilled", function () {
            expect(deferred.promise.promiseState).toBe($utils.PROMISE_STATE_FULFILLED);
        });

        it("should set arguments on promise", function () {
            expect(Array.prototype.slice.call(deferred.promise.deferredArguments)).toEqual(["foo", "bar"]);
        });
    });

    describe("rejection", function () {
        var result;

        beforeEach(function () {
            deferred.promise
                .then(null, function () {})
                .then(null, function () {});

            spyOn(deferred.promise.failureHandlers, '0');
            spyOn(deferred.promise.failureHandlers, '1');

            result = deferred.reject("foo", "bar");
        });

        it("should return self", function () {
            expect(result).toBe(deferred);
        });

        describe("when promise state is other than unfulfilled", function () {
            beforeEach(function () {
                deferred.promise.promiseState = $utils.PROMISE_STATE_FULFILLED;
                result = deferred.reject("foo", "bar");
            });

            it("should not call handlers", function () {
                expect(deferred.promise.failureHandlers[0]).toHaveBeenCalledTimes(1);
                expect(deferred.promise.failureHandlers[1]).toHaveBeenCalledTimes(1);
            });
        });

        it("should call handlers with resolution arguments", function () {
            expect(deferred.promise.failureHandlers[0]).toHaveBeenCalledWith("foo", "bar");
            expect(deferred.promise.failureHandlers[1]).toHaveBeenCalledWith("foo", "bar");
        });

        it("should set promise state to failed", function () {
            expect(deferred.promise.promiseState).toBe($utils.PROMISE_STATE_FAILED);
        });

        it("should set arguments on promise", function () {
            expect(Array.prototype.slice.call(deferred.promise.deferredArguments)).toEqual(["foo", "bar"]);
        });
    });

    describe("notification", function () {
        var result;

        beforeEach(function () {
            deferred.promise
                .then(null, null, function () {})
                .then(null, null, function () {});

            spyOn(deferred.promise.progressHandlers, '0');
            spyOn(deferred.promise.progressHandlers, '1');

            result = deferred.notify("foo", "bar");
        });

        it("should return self", function () {
            expect(result).toBe(deferred);
        });

        describe("when promise state is other than unfulfilled", function () {
            beforeEach(function () {
                deferred.promise.promiseState = $utils.PROMISE_STATE_FULFILLED;
                result = deferred.notify("foo", "bar");
            });

            it("should not call handlers", function () {
                expect(deferred.promise.progressHandlers[0]).toHaveBeenCalledTimes(1);
                expect(deferred.promise.progressHandlers[1]).toHaveBeenCalledTimes(1);
            });
        });

        it("should call handlers with notify arguments", function () {
            expect(deferred.promise.progressHandlers[0]).toHaveBeenCalledWith("foo", "bar");
            expect(deferred.promise.progressHandlers[1]).toHaveBeenCalledWith("foo", "bar");
        });

        it("should add arguments to promise", function () {
            expect(deferred.promise.notificationArguments
                .map(function (args) {
                    return Array.prototype.slice.call(args);
                })).toEqual([["foo", "bar"]]);
        });
    });
});