"use strict";

var $assert = window['giant-assert'];

describe("Assertion", function () {
    it("should return namespace", function () {
         expect($assert.assert(true, "Foo")).toBe($assert);
    });

    describe("when expression is falsey", function () {
        it("should throw", function () {
           expect(function () {
                $assert.assert(false);
           }).toThrow();
        });
    });
});